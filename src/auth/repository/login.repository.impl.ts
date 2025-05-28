import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LoginRecord } from '../entity/login-record.entity.js'
import { LoginRepository } from '../ports/login.repository.js'

@Injectable()
// Implementação concreta do repositório de login, usando TypeORM
export class LoginRepositoryImpl implements LoginRepository {
  constructor(
    // Injeta o repositório do TypeORM para manipular a entidade LoginRecord
    @InjectRepository(LoginRecord)
    private readonly repo: Repository<LoginRecord>,
  ) {}

  // Salva um novo registro de login no banco de dados
  async save(record: LoginRecord): Promise<LoginRecord> {
    return this.repo.save(record)
  }

  // Retorna todos os registros de login ordenados pela data de login (mais recente primeiro)
  async findAll(): Promise<LoginRecord[]> {
    return this.repo.find({ order: { loginAt: 'DESC' } })
  }
}
