import { PgFavoriteSongsRepo } from '@/infra/repos/postgres'
import { PgUsers } from '@/infra/repos/postgres/entities'
import { makeFakeDb } from '@/tests/infra/repos/postgres/mocks/connection'

import { IBackup } from 'pg-mem'
import { getRepository, Repository } from 'typeorm'

describe('PgFavoriteSongsRepo', () => {
  let sut: PgFavoriteSongsRepo
  let pgUserRepo: Repository<PgUsers>
  let backup: IBackup

  beforeAll(async () => {
    const db = await makeFakeDb()
    pgUserRepo = getRepository(PgUsers)
    backup = db.backup()
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgFavoriteSongsRepo()
  })

  describe('create', () => {
    it('should allow a user create a favorite song', async () => {
      const user = await pgUserRepo.save({ email: 'any_email', password: 'any_password' })
      const song = await sut.create({
        userId: user.id,
        songName: 'any_songName',
        artist: 'any_artist',
        album: 'any_album'
      })

      expect(song).toHaveProperty('favoriteId')
      expect(song).toMatchObject({
        songName: 'any_songName',
        artist: 'any_artist',
        album: 'any_album'
      })
    })
  })
})
