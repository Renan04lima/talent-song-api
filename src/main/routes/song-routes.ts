import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeCreateSongController } from '@/main/factories/application/controllers'
import { makeGetSongsController } from '@/main/factories/application/controllers/get-songs-controller'
import { auth } from '@/main/middlewares'

import { Router } from 'express'

export default (router: Router): void => {
  router.post('/favorite-songs', auth, adapt(makeCreateSongController()))
  router.get('/favorite-songs', auth, adapt(makeGetSongsController()))
}
