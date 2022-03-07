import { UpdateSongController } from '@/application/controllers'
import { makeUpdateSongUsecase } from '@/main/factories/domain/usecases'

export const makeUpdateSongController = (): UpdateSongController => {
  return new UpdateSongController(makeUpdateSongUsecase())
}
