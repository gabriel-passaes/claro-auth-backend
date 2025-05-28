import { Inject, Injectable } from '@nestjs/common'
import { LoginDTO } from '../dto/login.dto'
import { LoginRecord } from '../entity/login-record.entity.js'
import { ENCRYPTION_SERVICE, LOGIN_REPOSITORY } from '../injection-tokens.js'
import { EncryptionService } from '../ports/encryption.service'
import { LoginRepository } from '../ports/login.repository'

@Injectable()
// Caso de uso responsável por processar o login, gerar JWE e armazenar o histórico
export class LoginUseCase {
  constructor(
    // Injeta o serviço responsável pela criptografia JWE
    @Inject(ENCRYPTION_SERVICE)
    private readonly encryptionService: EncryptionService,

    // Injeta o repositório responsável por salvar o registro de login
    @Inject(LOGIN_REPOSITORY)
    private readonly loginRepository: LoginRepository,
  ) {}

  // Método que executa o processo de login
  async execute(dto: LoginDTO): Promise<string> {
    // Monta o payload a ser criptografado com os dados do login
    const loginData = {
      email: dto.email,
      password: dto.password,
      loginAt: new Date().toISOString(), // Gera data atual no padrão ISO
    }

    // Criptografa o payload com o serviço JWE
    const jwe = await this.encryptionService.encrypt(loginData)

    // Cria um novo registro de login para persistência no banco
    const record = new LoginRecord()
    record.email = dto.email
    record.password = dto.password
    record.jwe = jwe

    // Salva o registro no repositório (banco de dados)
    await this.loginRepository.save(record)

    // Retorna o token JWE gerado
    return jwe
  }
}
