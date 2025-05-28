import { Inject, Injectable } from '@nestjs/common'
import { DecryptDTO } from '../dto/decrypt.dto.js'
import { ENCRYPTION_SERVICE } from '../injection-tokens.js'
import { EncryptionService } from '../ports/encryption.service'

@Injectable()
// Classe responsável por executar o caso de uso de descriptografia
export class DecryptUseCase {
  constructor(
    // Injeta a implementação concreta do serviço de criptografia (abstraído por interface)
    @Inject(ENCRYPTION_SERVICE)
    private readonly encryptionService: EncryptionService,
  ) {}

  // Método principal que executa a lógica de descriptografar um JWE
  async execute(dto: DecryptDTO): Promise<{
    email: string
    password: string
    loginAt: string
  }> {
    // Descriptografa o conteúdo do JWE utilizando o serviço injetado
    const decrypted = await this.encryptionService.decrypt(dto.jwe)

    // Faz cast explícito para garantir retorno no formato esperado
    return decrypted as {
      email: string
      password: string
      loginAt: string
    }
  }
}
