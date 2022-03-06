import { CreateSong, GetSongs } from '@/domain/usecases'
import { PgSongs } from '@/infra/repos/postgres/entities'
import _ from 'lodash'
import { getRepository } from 'typeorm'

export class PgFavoriteSongsRepo implements CreateSong, GetSongs {
  async create (input: CreateSong.Input): Promise<CreateSong.Output> {
    const repo = getRepository(PgSongs)
    const { album, artist, favoriteId, songName } = await repo.save(input)
    return {
      album, artist, favoriteId, songName
    }
  }

  async get (input: GetSongs.Input): Promise<GetSongs.Output> {
    const repo = getRepository(PgSongs)
    const cleanedInput = _.pickBy(input)
    const songs = await repo.find({
      select: ['favoriteId', 'album', 'artist', 'songName'],
      where: cleanedInput
    })
    return songs
  }
}
