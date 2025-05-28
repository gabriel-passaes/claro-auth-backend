import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { DecryptDTO } from '../dto/decrypt.dto.js'
import { LoginDTO } from '../dto/login.dto.js'
import { DecryptUseCase } from '../usecase/decrypt.usecase.js'
import { HistoryUseCase } from '../usecase/history.usecase.js'
import { LoginUseCase } from '../usecase/login.usecase.js'

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase, // Caso de uso para login e geração de JWE
    private readonly decryptUseCase: DecryptUseCase, // Caso de uso para descriptografar o JWE
    private readonly historyUseCase: HistoryUseCase, // Caso de uso para listar o histórico de logins
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login and encrypt credentials using JWE' })
  @ApiBody({
    description: 'User login credentials',
    type: LoginDTO,
    examples: {
      example1: {
        summary: 'Valid login data',
        value: {
          email: 'admin@claro.com',
          password: '123456',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Encrypted credentials successfully returned',
    schema: {
      type: 'object',
      properties: {
        jwe: {
          type: 'string',
          example: 'eyJhbGciOiJSUzI1NiIsImVuYyI6IkEyNTZHQ00ifQ...',
        },
      },
    },
  })
  async login(@Body() dto: LoginDTO) {
    // Executa o caso de uso de login e retorna o token JWE gerado
    const jwe = await this.loginUseCase.execute(dto)
    return { jwe }
  }

  @Post('decrypt')
  @HttpCode(200)
  @ApiOperation({ summary: 'Decrypt a JWE token to retrieve credentials' })
  @ApiBody({
    description: 'JWE token to be decrypted',
    type: DecryptDTO,
    examples: {
      example1: {
        summary: 'Valid JWE token',
        value: {
          jwe: 'eyJhbGciOiJSUzI1NiIsImVuYyI6IkEyNTZHQ00ifQ...',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Decrypted payload successfully returned',
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'admin@claro.com',
        },
        password: {
          type: 'string',
          example: '123456',
        },
        loginAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-05-27T15:00:00Z',
        },
      },
    },
  })
  async decrypt(@Body() dto: DecryptDTO) {
    // Executa o caso de uso de decriptação e retorna o payload original
    return this.decryptUseCase.execute(dto)
  }

  @Get('history')
  @ApiOperation({ summary: 'Get login history records' })
  @ApiResponse({
    status: 200,
    description: 'List of all login attempts',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: 'a56f1c22-4e71-46c4-b48d-6f24a06e1535',
          },
          email: {
            type: 'string',
            example: 'admin@claro.com',
          },
          password: {
            type: 'string',
            example: '123456',
          },
          loginAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-05-27T15:00:00Z',
          },
          jwe: {
            type: 'string',
            example: 'eyJhbGciOiJSUzI1NiIsImVuYyI6IkEyNTZHQ00ifQ...',
          },
        },
      },
    },
  })
  async history() {
    // Retorna o histórico de logins registrados no sistema
    return this.historyUseCase.execute()
  }
}
