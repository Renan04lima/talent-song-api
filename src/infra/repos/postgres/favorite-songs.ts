import { CreateSong } from '@/domain/usecases'
import { PgSongs } from '@/infra/repos/postgres/entities'
import { getRepository } from 'typeorm'

export class PgFavoriteSongsRepo implements CreateSong {
  async create (input: CreateSong.Input): Promise<CreateSong.Output> {
    const repo = getRepository(PgSongs)
    const { album, artist, favoriteId, songName } = await repo.save(input)
    return {
      album, artist, favoriteId, songName
    }
  }
}
