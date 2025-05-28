// Interface que define o contrato para serviços de criptografia JWE
export interface EncryptionService {
  // Método para criptografar um objeto e retornar um JWE como string
  encrypt(payload: object): Promise<string>

  // Método para descriptografar um JWE e retornar o objeto original
  decrypt(jwe: string): Promise<object>
}
