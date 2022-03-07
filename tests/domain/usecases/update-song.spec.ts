
import { SongBelongToTheUserRepo, UpdateSongRepo } from '@/domain/contracts/repos'
import { setupUpdateSong, UpdateSong } from '@/domain/usecases'
import { NotBelogsError } from '@/application/errors'

import { faker } from '@faker-js/faker'
import { MockProxy, mock } from 'jest-mock-extended'

describe('UpdateSong', () => {
  let sut: UpdateSong
  let songBelongToTheUserRepoSpy: MockProxy<SongBelongToTheUserRepo>
  let updateSongRepoSpy: MockProxy<UpdateSongRepo>
  let fakeRequest: { userId: string, favoriteId: string, songName?: string, artist?: string, album?: string }
  let fakeSong: { songName: string, artist: string, album: string}

  beforeAll(() => {
    songBelongToTheUserRepoSpy = mock()
    updateSongRepoSpy = mock()
    fakeSong = {
      album: 'any_album',
      artist: 'any_artist',
      songName: 'any_songName'
    }
    fakeRequest = {
      userId: faker.datatype.uuid(),
      favoriteId: faker.datatype.uuid(),
      album: 'any_album',
      artist: 'any_artist',
      songName: 'any_songName'
    }
  })

  beforeEach(() => {
    sut = setupUpdateSong(updateSongRepoSpy, songBelongToTheUserRepoSpy)
    songBelongToTheUserRepoSpy.belong.mockResolvedValue(true)
    updateSongRepoSpy.update.mockResolvedValue(fakeSong)
  })

  test('should call UpdateSongRepo with correct input', async () => {
    await sut(fakeRequest)
    expect(updateSongRepoSpy.update).toHaveBeenCalledWith(fakeRequest)
    expect(updateSongRepoSpy.update).toHaveBeenCalledTimes(1)
  })

  test('should call SongBelongToTheUserRepo with correct input', async () => {
    await sut(fakeRequest)
    expect(songBelongToTheUserRepoSpy.belong).toHaveBeenCalledWith({
      favoriteId: fakeRequest.favoriteId,
      userId: fakeRequest.userId
    })
    expect(songBelongToTheUserRepoSpy.belong).toHaveBeenCalledTimes(1)
  })

  test('should rethrow if UpdateSongRepo throw', async () => {
    const error = new Error('infra_error')
    updateSongRepoSpy.update.mockRejectedValueOnce(error)
    const promise = sut(fakeRequest)
    await expect(promise).rejects.toThrow(error)
  })

  test('should rethrow if SongBelongToTheUserRepo throw', async () => {
    const error = new Error('infra_error')
    songBelongToTheUserRepoSpy.belong.mockRejectedValueOnce(error)
    const promise = sut(fakeRequest)
    await expect(promise).rejects.toThrow(error)
  })

  test('should throw NotBelogsError if the song not belogs to the user', async () => {
    const error = new NotBelogsError()
    songBelongToTheUserRepoSpy.belong.mockRejectedValueOnce(error)
    const promise = sut(fakeRequest)
    await expect(promise).rejects.toThrow(error)
  })

  test('should return valid data on success', async () => {
    const result = await sut(fakeRequest)
    expect(result).toEqual(fakeSong)
  })
})
