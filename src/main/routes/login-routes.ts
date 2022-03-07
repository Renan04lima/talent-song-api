import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeLoginController } from '@/main/factories/application/controllers'

import { Router } from 'express'

export default (router: Router): void => {
  router.post('/login', adapt(makeLoginController()))
}
