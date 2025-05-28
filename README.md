# 📺📞📱 Claro Backend — Autenticação com JWE (JSON Web Encryption)

Este projeto é um backend de autenticação construído com NestJS, TypeORM, e criptografia JWE com a biblioteca jose. Ele simula o processo de login, criptografa os dados sensíveis com JWE e mantém um histórico das tentativas.

---

## 📁 Estrutura do Projeto

<pre> ``` src/ ├── auth/ │ ├── controller/ # Endpoints HTTP expostos pelo AuthController │ ├── dto/ # DTOs (Data Transfer Objects) com validações │ ├── entity/ # Entidades persistidas no banco │ ├── ports/ # Interfaces (EncryptionService, LoginRepository) │ ├── repository/ # Implementações concretas do LoginRepository │ ├── service/ # Serviço de criptografia JWE │ ├── usecase/ # Casos de uso: login, decrypt, history │ ├── injection-tokens.ts # Tokens de injeção de dependência │ └── auth.module.ts # Módulo principal do domínio auth ├── seed.ts # Script de seed para popular dados de exemplo └── main.ts # Bootstrap da aplicação Nest ``` </pre>

---

## 🚀 Como rodar o projeto

### ✅ Requisitos

- 🟢 Node.js v18+  
- 🐘 PostgreSQL  
- 📦 pnpm (recomendado): `npm i -g pnpm`  
- 🐳 Docker (opcional)

---

### 🖥️ Setup Local

1. Instale as dependências:
   pnpm install

2. Configure as variáveis de ambiente:
   cp .env.example .env.local

3. Gere as chaves (caso ainda não tenha):
   mkdir keys
   openssl genrsa -out keys/private.pem 2048
   openssl rsa -in keys/private.pem -pubout -out keys/public.pem

4. Rode a aplicação localmente:
   pnpm start:dev

---

### 🐳 Rodando com Docker

1. Suba o banco PostgreSQL com Docker:
   docker-compose up -d

2. Rode a aplicação:
   pnpm start:dev

---

### ⚙️ Variáveis de Ambiente (.env.local)

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=claro_db

PRIVATE_KEY_PATH=./keys/private.pem
PUBLIC_KEY_PATH=./keys/public.pem

*As chaves devem ser arquivos .pem válidos.*

---

### 🧪 Rodar os Testes

pnpm test

*Os testes cobrem casos de uso de criptografia, login e recuperação de histórico.*

---

### 📬 Rotas Disponíveis (prefixo /auth)

POST   /auth/login    — Faz login e retorna dados criptografados via JWE
POST   /auth/decrypt  — Recebe um JWE e retorna os dados originais
GET    /auth/history  — Lista todas as tentativas de login registradas

---

### 📖 Acessar o Swagger

Após rodar a aplicação, acesse no navegador:

http://localhost:3000/api

*A documentação é gerada automaticamente via @nestjs/swagger.*

---

### 🚀 Teste Rápido com Postman

1. Login (POST /auth/login)

Envie JSON:

{
  "email": "admin@claro.com",
  "password": "123456"
}

Resposta esperada:

{
  "jwe": "eyJhbGciOiJSUzI1NiIsImVuYyI6IkEyNTZHQ00ifQ..."
}

---

2. Decrypt (POST /auth/decrypt)

Envie JSON:

{
  "jwe": "eyJhbGciOiJSUzI1NiIsImVuYyI6IkEyNTZHQ00ifQ..."
}

Resposta esperada:

{
  "email": "admin@claro.com",
  "password": "123456",
  "loginAt": "2025-05-27T15:00:00Z"
}

---

3. Histórico (GET /auth/history)

Resposta esperada:

[
  {
    "id": "uuid...",
    "email": "admin@claro.com",
    "password": "123456",
    "loginAt": "2025-05-27T15:00:00Z",
    "jwe": "eyJhbGciOiJSUzI1NiIsImVuYyI6IkEyNTZHQ00ifQ..."
  }
]

---

### 🔐 Geração de Chaves (caso precise)

1. Gera chave privada:
   openssl genrsa -out keys/private.pem 2048

2. Gera chave pública correspondente:
   openssl rsa -in keys/private.pem -pubout -out keys/public.pem

---

### 🌱 Dados de Seed

Para popular um registro inicial:

pnpm seed

*Esse script cria um usuário admin com JWE fictício no banco de dados.*

---

### 🏗️ Arquitetura

Este projeto segue princípios de Clean Architecture, com separação clara de responsabilidades:

- controller/: Interface de entrada (HTTP)
- usecase/: Lógica de aplicação
- service/: Serviços internos, como criptografia
- repository/: Persistência de dados
- ports/: Contratos e abstrações
- dto/: Dados de entrada com validações
- entity/: Representações do banco (TypeORM)

---

### 🛠️ TODO

- Adicionar autenticação real com JWT
- Criptografar senha no banco
- Integração com frontend (ex: login com JWE)
- Deploy automatizado via GitHub Actions

---

### 🤝 Contribuição

Contribuições são bem-vindas! Envie PRs ou sugestões.

---

Licença

Este projeto está sob licença UNLICENSED. Uso interno apenas.
