import { PgFavoriteSongsRepo } from '@/infra/repos/postgres'

export const makePgFavoriteSongsRepo = (): PgFavoriteSongsRepo => {
  return new PgFavoriteSongsRepo()
}
