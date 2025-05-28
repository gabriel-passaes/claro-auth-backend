import { IsNotEmpty } from 'class-validator'

// DTO usado para descriptografar um token JWE
export class DecryptDTO {
  @IsNotEmpty() // Garante que o JWE não seja vazio
  jwe!: string
}
