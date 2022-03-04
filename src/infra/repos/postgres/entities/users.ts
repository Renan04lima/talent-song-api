import { PgSongs } from '@/infra/repos/postgres/entities'
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'

@Entity({ name: 'users' })
export class PgUsers {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  id!: string

  @Column({ name: 'email' })
  email!: string

  @Column({ name: 'password' })
  password!: string

  // relationships
  @OneToMany(() => PgSongs, song => song.user)
  songs!: PgSongs[]
}
