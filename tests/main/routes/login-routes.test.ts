import app from '@/main/config/app'

import { IBackup } from 'pg-mem'
import { getRepository, Repository } from 'typeorm'
import request from 'supertest'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks/connection'
import { PgUsers } from '@/infra/repos/postgres/entities'
import { hash } from 'bcrypt'

describe('Login Routes', () => {
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

  describe('POST /login', () => {
    it('should return 200 with valid data', async () => {
      const passwordHashed = await hash('any_password', 12)
      await pgUserRepo.save({ email: 'any_email', password: passwordHashed })
      const { status, body } = await request(app)
        .post('/login')
        .send({
          email: 'any_email', password: 'any_password'
        })

      expect(status).toBe(200)
      expect(body).toHaveProperty('token')
    })
  })
})
