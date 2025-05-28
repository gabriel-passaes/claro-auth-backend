import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

// Entidade que representa o registro de login criptografado
@Entity('login_records')
export class LoginRecord {
  @PrimaryGeneratedColumn('uuid') // ID único gerado automaticamente
  id!: string

  @Column() // Email do usuário que fez o login
  email!: string

  @Column() // Senha enviada no momento do login (em uso apenas para fins de demonstração; **evite armazenar senhas em texto puro em produção**)
  password!: string

  @CreateDateColumn() // Data e hora do login, preenchida automaticamente
  loginAt!: Date

  @Column({ type: 'text' }) // Token JWE gerado a partir do login
  jwe!: string
}
