import { CreateSongController } from '@/application/controllers'
import { Controller } from '@/application/helpers'
import { makePgFavoriteSongsRepo } from '@/main/factories/infra/repos/postgres'

export const makeCreateSongController = (): Controller => {
  return new CreateSongController(makePgFavoriteSongsRepo().create)
}
