import { LoginController } from '@/application/controllers'
import { makeLoginUsecase } from '@/main/factories/domain/usecases'

export const makeLoginController = (): LoginController => {
  return new LoginController(makeLoginUsecase())
}
