import { setupLogin, Login } from '@/domain/usecases'
import { makeBcryptHash, makeJwtTokenHandler } from '@/main/factories/infra/gateways'
import { makePgUserAccountRepo } from '@/main/factories/infra/repos/postgres'

export const makeLoginUsecase = (): Login => {
  return setupLogin(makePgUserAccountRepo(), makeBcryptHash(), makeJwtTokenHandler(), 30 * 60 * 1000)
}
