import { DeleteSongController } from '@/application/controllers'
import { makeDeleteSongUsecase } from '@/main/factories/domain/usecases'

export const makeDeleteSongController = (): DeleteSongController => {
  return new DeleteSongController(makeDeleteSongUsecase())
}
