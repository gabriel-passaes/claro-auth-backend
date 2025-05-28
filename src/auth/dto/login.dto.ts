import { IsEmail, IsNotEmpty } from 'class-validator'

// DTO usado para login e geração do token JWE
export class LoginDTO {
  @IsEmail() // Valida que o campo é um e-mail válido
  email!: string

  @IsNotEmpty() // Garante que a senha não esteja vazia
  password!: string
}
