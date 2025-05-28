import { LoginRecord } from '../entity/login-record.entity'

// Interface que define o contrato do repositório para manipular registros de login
export interface LoginRepository {
  // Persiste um registro de login no banco de dados
  save(record: LoginRecord): Promise<LoginRecord>

  // Retorna todos os registros de login armazenados
  findAll(): Promise<LoginRecord[]>
}
