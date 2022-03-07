import { GetSongsController } from '@/application/controllers'
import { Controller } from '@/application/helpers'
import { makePgFavoriteSongsRepo } from '@/main/factories/infra/repos/postgres'

export const makeGetSongsController = (): Controller => {
  return new GetSongsController(makePgFavoriteSongsRepo().get)
}
