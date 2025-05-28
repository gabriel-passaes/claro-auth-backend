import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../../src/app.module.js'
import { DecryptDTO } from '../../src/auth/dto/decrypt.dto'
import { LoginDTO } from '../../src/auth/dto/login.dto'

describe('AuthController (e2e)', () => {
  let app: INestApplication

  // Define um timeout maior para execução dos testes E2E
  jest.setTimeout(20000)

  // Executa antes de todos os testes para configurar a aplicação Nest
  beforeAll(async () => {
    // Cria o módulo com todos os imports reais da aplicação
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Usa o AppModule completo
    }).compile()

    // Cria a instância real da aplicação
    app = moduleFixture.createNestApplication()

    // Ativa o uso global do ValidationPipe para validação automática dos DTOs
    app.useGlobalPipes(new ValidationPipe())

    // Inicializa a aplicação
    await app.init()
  })

  // Fecha a aplicação após todos os testes
  afterAll(async () => {
    await app.close()
  })

  it('POST /auth/login deve retornar um JWE válido', async () => {
    // DTO de entrada com email e senha
    const loginDto: LoginDTO = {
      email: 'user@example.com',
      password: 'secure123',
    }

    // Envia a requisição POST para o endpoint de login
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(201) // Espera código 201 (Created)

    // Extrai o JWE da resposta
    const { jwe } = response.body as { jwe: string }

    // Verifica se o JWE foi retornado e é uma string
    expect(jwe).toBeDefined()
    expect(typeof jwe).toBe('string')
  })

  it('POST /auth/decrypt deve retornar os dados descriptografados', async () => {
    // Primeiro realiza o login para obter o JWE
    const loginDto: LoginDTO = {
      email: 'user@example.com',
      password: 'secure123',
    }

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(201)

    const loginBody = loginResponse.body as { jwe: string }

    // Cria o DTO de decrypt com o JWE recebido
    const decryptDto: DecryptDTO = { jwe: loginBody.jwe }

    // Envia o JWE para descriptografar no endpoint /auth/decrypt
    const decryptResponse = await request(app.getHttpServer())
      .post('/auth/decrypt')
      .send(decryptDto)
      .expect(200)

    // Extrai o corpo da resposta descriptografada
    const decrypted = decryptResponse.body as {
      email: string
      password: string
      loginAt: string
    }

    // Verifica se os dados retornados correspondem ao que foi enviado originalmente
    expect(decrypted.email).toBe(loginDto.email)
    expect(decrypted.password).toBe(loginDto.password)
    expect(typeof decrypted.loginAt).toBe('string') // Verifica que loginAt é uma string
  })

  it('GET /auth/history deve retornar histórico com pelo menos um registro', async () => {
    // Envia uma requisição GET para recuperar o histórico de logins
    const response = await request(app.getHttpServer()).get('/auth/history').expect(200)

    const history = response.body as Array<{
      id: string
      email: string
      jwe: string
      loginAt: string
    }>

    // Verifica se é um array e se há pelo menos um registro
    expect(Array.isArray(history)).toBe(true)
    expect(history.length).toBeGreaterThan(0)

    // Verifica se o primeiro item do histórico possui as propriedades esperadas
    const first = history[0]
    expect(first).toHaveProperty('id')
    expect(first).toHaveProperty('email')
    expect(first).toHaveProperty('jwe')
    expect(first).toHaveProperty('loginAt')
  })
})
