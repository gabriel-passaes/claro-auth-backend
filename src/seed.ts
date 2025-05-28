import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { LoginRecord } from './auth/entity/login-record.entity.js'

// Cria a instância de conexão com o banco de dados PostgreSQL
const AppDataSource = new DataSource({
  type: 'postgres', // Define o tipo de banco (PostgreSQL)
  host: 'localhost', // Host onde o banco está rodando
  port: 5432, // Porta padrão do PostgreSQL
  username: 'postgres', // Usuário do banco
  password: 'postgres', // Senha do banco
  database: 'claro_db', // Nome do banco de dados
  entities: [LoginRecord], // Entidades que o TypeORM vai mapear
  synchronize: true, // Sincroniza as entidades com o banco (use com cuidado em produção)
})

// Inicializa a conexão com o banco de dados
await AppDataSource.initialize()

// Insere um registro inicial na tabela login_records com dados simulados
await AppDataSource.manager.save(LoginRecord, {
  email: 'admin@claro.com', // E-mail de exemplo
  password: '123456', // Senha de exemplo
  jwe: 'token', // Token JWE fictício
  loginAt: new Date(), // Data e hora atual
})

// Finaliza a conexão com o banco
await AppDataSource.destroy()

// Exibe uma mensagem de sucesso no console
console.log('✅ Seed concluído com sucesso')
