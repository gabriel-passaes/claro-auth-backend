import { webcrypto } from 'crypto'
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as Crypto
}

import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { readFileSync } from 'fs'
import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  })

  const publicKeyPath = process.env.PUBLIC_KEY
  const privateKeyPath = process.env.PRIVATE_KEY

  if (!publicKeyPath) {
    throw new Error('PUBLIC_KEY não está definida nas variáveis de ambiente')
  }

  try {
    const content = readFileSync(publicKeyPath, 'utf8')
    if (!content || !content.includes('PUBLIC KEY')) {
      throw new Error('PUBLIC_KEY inválida ou vazia')
    }
    Logger.log('PUBLIC_KEY carregada com sucesso', 'Bootstrap')
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro desconhecido ao ler PUBLIC_KEY'
    throw new Error(`Erro ao ler PUBLIC_KEY: ${msg}`)
  }

  if (!privateKeyPath) {
    throw new Error('PRIVATE_KEY não está definida nas variáveis de ambiente')
  }

  try {
    const content = readFileSync(privateKeyPath, 'utf8')
    if (!content || !content.includes('PRIVATE KEY')) {
      throw new Error('PRIVATE_KEY inválida ou vazia')
    }
    Logger.log('PRIVATE_KEY carregada com sucesso', 'Bootstrap')
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro desconhecido ao ler PRIVATE_KEY'
    throw new Error(`Erro ao ler PRIVATE_KEY: ${msg}`)
  }

  const config = new DocumentBuilder()
    .setTitle('Claro Backend API')
    .setDescription('Documentação da API de autenticação')
    .setVersion('1.0')
    .addTag('auth')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(3000)
}

void bootstrap()
