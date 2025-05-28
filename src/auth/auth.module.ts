import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthController } from './controller/auth.controller.js'
import { LoginRecord } from './entity/login-record.entity.js'
import { ENCRYPTION_SERVICE, LOGIN_REPOSITORY } from './injection-tokens.js'
import { LoginRepositoryImpl } from './repository/login.repository.impl.js'
import { JweEncryptionService } from './service/jwe-encryption.service.js'
import { DecryptUseCase } from './usecase/decrypt.usecase.js'
import { HistoryUseCase } from './usecase/history.usecase.js'
import { LoginUseCase } from './usecase/login.usecase.js'

@Module({
  // Registra a entidade `LoginRecord` no contexto do TypeORM para que seja possível usar repositórios customizados
  imports: [TypeOrmModule.forFeature([LoginRecord])],

  // Define os controllers que pertencem a este módulo
  controllers: [AuthController],

  // Define os providers (serviços, usecases e bindings de injeção de dependência)
  providers: [
    JweEncryptionService, // Serviço de criptografia JWE
    LoginRepositoryImpl, // Implementação concreta do repositório de login
    LoginUseCase, // Caso de uso de login
    DecryptUseCase, // Caso de uso de descriptografia
    HistoryUseCase, // Caso de uso de histórico

    // Vincula a interface ENCRYPTION_SERVICE à implementação já existente JweEncryptionService
    { provide: ENCRYPTION_SERVICE, useExisting: JweEncryptionService },

    // Vincula a interface LOGIN_REPOSITORY à implementação já existente LoginRepositoryImpl
    { provide: LOGIN_REPOSITORY, useExisting: LoginRepositoryImpl },
  ],
})
export class AuthModule {}
