import { makeJwtTokenHandler } from '@/main/factories/infra/gateways'
import { AuthMiddleware } from '@/application/middlewares'

export const makeAuthMiddleware = (): AuthMiddleware => {
  const jwt = makeJwtTokenHandler()
  return new AuthMiddleware(jwt.validate.bind(jwt))
}
