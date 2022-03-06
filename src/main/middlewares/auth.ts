import { adaptExpressMiddleware } from '@/main/adapters'
import { makeAuthMiddleware } from '@/main/factories/application/middlewares'

export const auth = adaptExpressMiddleware(makeAuthMiddleware())
