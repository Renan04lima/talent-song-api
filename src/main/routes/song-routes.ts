import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeCreateSongController } from '@/main/factories/application/controllers'
import { auth } from '@/main/middlewares'

import { Router } from 'express'

export default (router: Router): void => {
  router.post('/favorite-songs', auth, adapt(makeCreateSongController()))
}
