import app from '@/main/config/app'
import env from '@/main/config/env'

import { IBackup } from 'pg-mem'
import { getRepository, Repository } from 'typeorm'
import { sign } from 'jsonwebtoken'
import request from 'supertest'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks/connection'
import { PgUsers } from '@/infra/repos/postgres/entities'

describe('User Routes', () => {
  let backup: IBackup
  let pgUserRepo: Repository<PgUsers>

  beforeAll(async () => {
    const db = await makeFakeDb()
    backup = db.backup()
    pgUserRepo = getRepository(PgUsers)
  })

  beforeEach(() => {
    backup.restore()
  })

  describe('POST /favorite-songs', () => {
    it('should return 403 if authorization header is not present', async () => {
      const { status } = await request(app)
        .post('/favorite-songs')

      expect(status).toBe(403)
    })

    it('should return 200 with valid data', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_email', password: 'any_password' })
      const authorization = sign({ key: id }, env.jwtSecret)

      const { status, body } = await request(app)
        .post('/favorite-songs')
        .set({ authorization })
        .send({
          songName: 'any_songName',
          artist: 'any_artist',
          album: 'any_album'
        })

      expect(status).toBe(201)
      expect(body).toHaveProperty('favoriteId')
      expect(body).toMatchObject({
        songName: 'any_songName',
        artist: 'any_artist',
        album: 'any_album'
      })
    })
  })
})
