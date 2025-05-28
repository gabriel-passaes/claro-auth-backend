// Cria um token simbólico único para representar o serviço de criptografia (EncryptionService)
// Esse token é utilizado na injeção de dependência para garantir que o provider certo seja resolvido
export const ENCRYPTION_SERVICE = Symbol('EncryptionService')

// Cria um token simbólico único para representar o repositório de login (LoginRepository)
// Permite desacoplamento entre a interface e a implementação concreta do repositório
export const LOGIN_REPOSITORY = Symbol('LoginRepository')
