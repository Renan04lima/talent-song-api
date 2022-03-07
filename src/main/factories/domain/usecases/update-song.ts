import { setupUpdateSong, UpdateSong } from '@/domain/usecases'
import { makePgFavoriteSongsRepo } from '@/main/factories/infra/repos/postgres'

export const makeUpdateSongUsecase = (): UpdateSong => {
  const repo = makePgFavoriteSongsRepo()
  return setupUpdateSong(repo, repo)
}
