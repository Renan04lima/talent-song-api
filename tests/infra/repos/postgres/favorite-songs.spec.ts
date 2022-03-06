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

  describe('get', () => {
    it('should find all user songs', async () => {
      const user = await pgUserRepo.save({ email: 'any_email', password: 'any_password' })
      const song = await sut.create({
        userId: user.id,
        songName: 'any_songName_1',
        artist: 'any_artist_1',
        album: 'any_album_1'
      })
      const song2 = await sut.create({
        userId: user.id,
        songName: 'any_songName_2',
        artist: 'any_artist_2',
        album: 'any_album_2'
      })

      const result = await sut.get({
        userId: user.id
      })

      expect(result).toHaveLength(2)
      expect(result[0].favoriteId).toBe(song.favoriteId)
      expect(result[1].favoriteId).toBe(song2.favoriteId)
    })

    it('should not find another user\'s sounds', async () => {
      const user = await pgUserRepo.save({ email: 'any_email', password: 'any_password' })
      const userWithoutSongs = await pgUserRepo.save({ email: 'any_email_2', password: 'any_password' })
      await sut.create({
        userId: user.id,
        songName: 'any_songName_1',
        artist: 'any_artist_1',
        album: 'any_album_1'
      })

      const result = await sut.get({
        userId: userWithoutSongs.id
      })

      expect(result).toHaveLength(0)
    })
  })
})
