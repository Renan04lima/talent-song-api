import { PgUserAccountRepo } from '@/infra/repos/postgres'
import { PgUsers } from '@/infra/repos/postgres/entities'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks/connection'

import { IBackup } from 'pg-mem'
import { getRepository, Repository } from 'typeorm'

describe('PgUserAccountRepo', () => {
  let sut: PgUserAccountRepo
  let pgUserRepo: Repository<PgUsers>
  let backup: IBackup

  beforeAll(async () => {
    const db = await makeFakeDb()
    pgUserRepo = getRepository(PgUsers)
    backup = db.backup()
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgUserAccountRepo()
  })

  describe('load', () => {
    it('should load a user', async () => {
      await pgUserRepo.save({ email: 'any_email', password: 'any_password' })
      const user = await sut.load({ email: 'any_email' })
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('password')
    })

    it('should return undefined if not exists', async () => {
      const user = await sut.load({ email: 'any_email' })
      expect(user).toBeUndefined()
    })
  })
})
