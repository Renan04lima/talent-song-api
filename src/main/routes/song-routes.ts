import { adaptExpressRoute as adapt } from '@/main/adapters'
import { makeCreateSongController, makeGetSongsController, makeUpdateSongController } from '@/main/factories/application/controllers'
import { auth } from '@/main/middlewares'

import { Router } from 'express'

export default (router: Router): void => {
  router.post('/favorite-songs', auth, adapt(makeCreateSongController()))
  router.get('/favorite-songs', auth, adapt(makeGetSongsController()))
  router.put('/favorite-songs/:favoriteId', auth, adapt(makeUpdateSongController()))
}
