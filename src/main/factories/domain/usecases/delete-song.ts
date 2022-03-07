import { setupDeleteSong, DeleteSong } from '@/domain/usecases'
import { makePgFavoriteSongsRepo } from '@/main/factories/infra/repos/postgres'

export const makeDeleteSongUsecase = (): DeleteSong => {
  const repo = makePgFavoriteSongsRepo()
  return setupDeleteSong(repo, repo)
}
