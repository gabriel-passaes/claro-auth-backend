import { Injectable, InternalServerErrorException } from '@nestjs/common'
import * as fs from 'fs'
import { CompactEncrypt, compactDecrypt, importPKCS8, importSPKI } from 'jose'
import * as path from 'path'
import { TextDecoder, TextEncoder } from 'util'

@Injectable()
// Serviço responsável por criptografar e descriptografar dados usando JWE
export class JweEncryptionService {
  // Algoritmo de criptografia de chave pública
  private readonly alg = 'RSA-OAEP-256'
  // Algoritmo de criptografia simétrica do conteúdo
  private readonly enc = 'A256GCM'

  // Chaves carregadas do sistema de arquivos
  private readonly publicKey: string
  private readonly privateKey: string

  constructor() {
    try {
      // Caminho das chaves (por variável de ambiente ou valor padrão)
      const publicKeyPath = process.env.PUBLIC_KEY_PATH || './keys/public.pem'
      const privateKeyPath = process.env.PRIVATE_KEY_PATH || './keys/private.pem'

      // Lê e armazena o conteúdo das chaves públicas e privadas
      this.publicKey = fs.readFileSync(path.resolve(publicKeyPath), 'utf8').trim()
      this.privateKey = fs.readFileSync(path.resolve(privateKeyPath), 'utf8').trim()
    } catch (e) {
      // Em caso de erro ao carregar as chaves, lança exceção genérica
      throw new Error(
        'Erro ao carregar as chaves: ' + (e instanceof Error ? e.message : 'Erro desconhecido'),
      )
    }
  }

  // Método responsável por criptografar o payload como JWE
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    try {
      // Converte a chave pública em formato utilizável pelo JOSE
      const key = await importSPKI(this.publicKey, this.alg)
      // Codifica o payload como string e depois como array de bytes
      const encodedPayload = new TextEncoder().encode(JSON.stringify(payload))

      // Cria e retorna o token JWE com o payload criptografado
      return await new CompactEncrypt(encodedPayload)
        .setProtectedHeader({ alg: this.alg, enc: this.enc })
        .encrypt(key)
    } catch (error: unknown) {
      // Em caso de falha, lança exceção HTTP 500 com detalhe
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      throw new InternalServerErrorException(`Erro ao criptografar dados: ${errorMessage}`)
    }
  }

  // Método responsável por descriptografar o JWE e retornar o objeto original
  async decrypt(jwe: string): Promise<Record<string, unknown>> {
    try {
      // Converte a chave privada para uso na descriptografia
      const key = await importPKCS8(this.privateKey, this.alg)
      // Realiza a descriptografia do JWE
      const { plaintext } = await compactDecrypt(jwe, key)
      // Decodifica o conteúdo descriptografado de volta para string e objeto
      const decodedPayload = new TextDecoder().decode(plaintext)

      return JSON.parse(decodedPayload) as Record<string, unknown>
    } catch (error: unknown) {
      // Em caso de erro, lança exceção interna com mensagem detalhada
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      throw new InternalServerErrorException(`Erro ao descriptografar JWE: ${errorMessage}`)
    }
  }
}
