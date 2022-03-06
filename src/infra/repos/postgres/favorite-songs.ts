import { CreateSong, GetSongs } from '@/domain/usecases'
import { PgSongs } from '@/infra/repos/postgres/entities'
import { getRepository } from 'typeorm'

export class PgFavoriteSongsRepo implements CreateSong, GetSongs {
  async create (input: CreateSong.Input): Promise<CreateSong.Output> {
    const repo = getRepository(PgSongs)
    const { album, artist, favoriteId, songName } = await repo.save(input)
    return {
      album, artist, favoriteId, songName
    }
  }

  async get ({ userId }: GetSongs.Input): Promise<GetSongs.Output> {
    const repo = getRepository(PgSongs)
    const songs = await repo.find({
      select: ['favoriteId', 'album', 'artist', 'songName'],
      where: [
        { userId }
      ]
    })
    return songs
  }
}
