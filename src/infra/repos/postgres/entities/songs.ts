import { PgUsers } from '@/infra/repos/postgres/entities'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'

@Entity({ name: 'favorite_songs' })
export class PgSongs {
  @PrimaryGeneratedColumn('uuid', { name: 'favorite_id' })
  favoriteId!: string

  @Column({ name: 'song_name' })
  songName!: string

  @Column({ name: 'artist' })
  artist!: string

  @Column({ name: 'album' })
  album!: string

  @Column({ name: 'user_id' })
  userId!: string

  // relationships
  @ManyToOne(() => PgUsers, user => user.songs)
  @JoinColumn({ name: 'userId' })
  user!: PgUsers
}
