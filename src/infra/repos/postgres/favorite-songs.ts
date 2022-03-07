import { CreateSongRepo, GetSongsRepo, SongBelongToTheUserRepo } from '@/domain/contracts/repos'
import { PgSongs } from '@/infra/repos/postgres/entities'
import _ from 'lodash'
import { getRepository } from 'typeorm'

export class PgFavoriteSongsRepo implements CreateSongRepo, GetSongsRepo, SongBelongToTheUserRepo {
  async create (input: CreateSongRepo.Input): Promise<CreateSongRepo.Output> {
    const repo = getRepository(PgSongs)
    const { album, artist, favoriteId, songName } = await repo.save(input)
    return {
      album, artist, favoriteId, songName
    }
  }

  async get (input: GetSongsRepo.Input): Promise<GetSongsRepo.Output> {
    const repo = getRepository(PgSongs)
    const cleanedInput = _.pickBy(input)
    const songs = await repo.find({
      select: ['favoriteId', 'album', 'artist', 'songName'],
      where: cleanedInput
    })
    return songs
  }

  async belong ({ userId, favoriteId }: SongBelongToTheUserRepo.Input): Promise<boolean> {
    const repo = getRepository(PgSongs)
    const belogs = await repo.findOne({ where: { userId, favoriteId } })
    return !(belogs == null)
  }
}
