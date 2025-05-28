import { Inject, Injectable } from '@nestjs/common'
import { LoginRecord } from '../entity/login-record.entity'
import { LOGIN_REPOSITORY } from '../injection-tokens.js'
import { LoginRepository } from '../ports/login.repository'

@Injectable()
// Classe responsável por recuperar o histórico de logins registrados
export class HistoryUseCase {
  constructor(
    // Injeta a implementação concreta do repositório de login
    @Inject(LOGIN_REPOSITORY)
    private readonly loginRepository: LoginRepository,
  ) {}

  // Executa a consulta de todos os registros de login
  async execute(): Promise<LoginRecord[]> {
    // Busca os registros no repositório, já ordenados por data (implementação em LoginRepositoryImpl)
    return this.loginRepository.findAll()
  }
}
