import { Test, TestingModule } from '@nestjs/testing'
import { LoginRecord } from '../../src/auth/entity/login-record.entity.js'
import { LOGIN_REPOSITORY } from '../../src/auth/injection-tokens.js'
import { LoginRepository } from '../../src/auth/ports/login.repository'
import { HistoryUseCase } from '../../src/auth/usecase/history.usecase'

describe('HistoryUseCase', () => {
  let useCase: HistoryUseCase
  let loginRepository: jest.Mocked<LoginRepository> // Mock do repositório de login

  beforeEach(async () => {
    // Simula os métodos do repositório
    loginRepository = {
      save: jest.fn(), // Não utilizado neste teste
      findAll: jest
        .fn()
        .mockResolvedValue([
          { id: '1', email: 'a@a.com', password: '123', jwe: 'jwe1' } as LoginRecord,
          { id: '2', email: 'b@b.com', password: '456', jwe: 'jwe2' } as LoginRecord,
        ]), // Retorno simulado com duas entradas
    }

    // Cria o módulo de teste com o caso de uso e o mock injetado
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryUseCase, { provide: LOGIN_REPOSITORY, useValue: loginRepository }],
    }).compile()

    // Recupera a instância do caso de uso
    useCase = module.get(HistoryUseCase)
  })

  it('should return all login records', async () => {
    // Espiona o método findAll para garantir que foi chamado
    const findAllSpy = jest.spyOn(loginRepository, 'findAll')

    // Executa o caso de uso
    const result = await useCase.execute()

    // Verifica se o método findAll foi chamado
    expect(findAllSpy).toHaveBeenCalled()

    // Verifica se o resultado possui duas entradas e os IDs estão corretos
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe('1')
    expect(result[1].id).toBe('2')
  })
})
