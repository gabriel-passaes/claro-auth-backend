import { Test, TestingModule } from '@nestjs/testing'
import { DecryptDTO } from '../../src/auth/dto/decrypt.dto'
import { ENCRYPTION_SERVICE } from '../../src/auth/injection-tokens.js'
import { EncryptionService } from '../../src/auth/ports/encryption.service'
import { DecryptUseCase } from '../../src/auth/usecase/decrypt.usecase'

describe('DecryptUseCase', () => {
  let useCase: DecryptUseCase
  let encryptionService: jest.Mocked<EncryptionService> // Mock tipado da interface do serviço de criptografia

  beforeEach(async () => {
    // Simula o comportamento do serviço de criptografia
    encryptionService = {
      encrypt: jest.fn(), // Não utilizado neste teste
      decrypt: jest.fn().mockResolvedValue({
        email: 'user@example.com',
        password: '123456',
        loginAt: '2025-01-01T12:00:00Z',
      }), // Retorno simulado para o método decrypt
    }

    // Cria um módulo de teste com injeção do caso de uso e serviço mockado
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DecryptUseCase,
        { provide: ENCRYPTION_SERVICE, useValue: encryptionService }, // Injeção do mock
      ],
    }).compile()

    // Obtém a instância do caso de uso a ser testado
    useCase = module.get(DecryptUseCase)
  })

  it('should decrypt the token and return the payload', async () => {
    // DTO de entrada contendo o token JWE a ser descriptografado
    const dto: DecryptDTO = { jwe: 'mocked-token' }

    // Espiona o método decrypt para verificar se foi chamado corretamente
    const decryptSpy = jest.spyOn(encryptionService, 'decrypt')

    // Executa o caso de uso
    const result = await useCase.execute(dto)

    // Verifica se o método decrypt foi chamado com o token correto
    expect(decryptSpy).toHaveBeenCalledWith('mocked-token')

    // Verifica se o resultado retornado é igual ao payload esperado
    expect(result).toEqual({
      email: 'user@example.com',
      password: '123456',
      loginAt: '2025-01-01T12:00:00Z',
    })
  })
})
