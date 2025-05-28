import { Test, TestingModule } from '@nestjs/testing'
import { LoginDTO } from '../../src/auth/dto/login.dto'
import { ENCRYPTION_SERVICE, LOGIN_REPOSITORY } from '../../src/auth/injection-tokens.js'
import { EncryptionService } from '../../src/auth/ports/encryption.service'
import { LoginRepository } from '../../src/auth/ports/login.repository.js'
import { LoginUseCase } from '../../src/auth/usecase/login.usecase.js'

describe('LoginUseCase', () => {
  let useCase: LoginUseCase
  let encryptionService: jest.Mocked<EncryptionService> // Mock do serviço de criptografia
  let loginRepository: jest.Mocked<LoginRepository> // Mock do repositório de login

  beforeEach(async () => {
    // Define o comportamento simulado dos métodos do serviço de criptografia
    encryptionService = {
      encrypt: jest.fn().mockResolvedValue('mocked-jwe'), // Simula a geração de um token JWE
      decrypt: jest.fn(), // Não usado neste teste
    }

    // Define o comportamento simulado do repositório de login
    loginRepository = {
      save: jest.fn().mockResolvedValue({}), // Simula o salvamento do login
      findAll: jest.fn(), // Não usado neste teste
    }

    // Cria o módulo de teste com os mocks injetados
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        { provide: ENCRYPTION_SERVICE, useValue: encryptionService },
        { provide: LOGIN_REPOSITORY, useValue: loginRepository },
      ],
    }).compile()

    // Recupera a instância do caso de uso
    useCase = module.get(LoginUseCase)
  })

  it('should encrypt and save login data', async () => {
    // DTO com os dados de entrada
    const dto: LoginDTO = {
      email: 'user@example.com',
      password: '123456',
    }

    // Espiona os métodos para validar a chamada
    const encryptSpy = jest.spyOn(encryptionService, 'encrypt')
    const saveSpy = jest.spyOn(loginRepository, 'save')

    // Executa o caso de uso
    const result: string = await useCase.execute(dto)

    // Recupera o argumento passado para encrypt e faz type assertion
    const encryptedPayload = encryptSpy.mock.calls[0][0] as {
      email: string
      password: string
      loginAt: string
    }

    // Valida os campos do payload criptografado
    expect(encryptedPayload.email).toBe(dto.email)
    expect(encryptedPayload.password).toBe(dto.password)
    expect(typeof encryptedPayload.loginAt).toBe('string')

    // Valida se o repositório recebeu os dados esperados
    expect(saveSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        email: dto.email,
        password: dto.password,
        jwe: 'mocked-jwe',
      }),
    )

    // Verifica se o retorno do use case é o JWE mockado
    expect(result).toBe('mocked-jwe')
  })
})
