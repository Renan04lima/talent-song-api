
import { SongBelongToTheUserRepo, DeleteSongRepo } from '@/domain/contracts/repos'
import { setupDeleteSong, DeleteSong } from '@/domain/usecases'
import { NotBelogsError } from '@/application/errors'

import { faker } from '@faker-js/faker'
import { MockProxy, mock } from 'jest-mock-extended'

describe('DeleteSong', () => {
  let sut: DeleteSong
  let songBelongToTheUserRepoSpy: MockProxy<SongBelongToTheUserRepo>
  let deleteSongRepoSpy: MockProxy<DeleteSongRepo>
  let fakeRequest: { userId: string, favoriteId: string}

  beforeAll(() => {
    songBelongToTheUserRepoSpy = mock()
    deleteSongRepoSpy = mock()

    fakeRequest = {
      userId: faker.datatype.uuid(),
      favoriteId: faker.datatype.uuid()
    }
  })

  beforeEach(() => {
    sut = setupDeleteSong(deleteSongRepoSpy, songBelongToTheUserRepoSpy)
    songBelongToTheUserRepoSpy.belong.mockResolvedValue(true)
    deleteSongRepoSpy.delete.mockResolvedValue(Promise.resolve())
  })

  test('should call DeleteSongRepo with correct input', async () => {
    await sut(fakeRequest)
    expect(deleteSongRepoSpy.delete).toHaveBeenCalledWith(fakeRequest)
    expect(deleteSongRepoSpy.delete).toHaveBeenCalledTimes(1)
  })

  test('should call SongBelongToTheUserRepo with correct input', async () => {
    await sut(fakeRequest)
    expect(songBelongToTheUserRepoSpy.belong).toHaveBeenCalledWith({
      favoriteId: fakeRequest.favoriteId,
      userId: fakeRequest.userId
    })
    expect(songBelongToTheUserRepoSpy.belong).toHaveBeenCalledTimes(1)
  })

  test('should rethrow if DeleteSongRepo throw', async () => {
    const error = new Error('infra_error')
    deleteSongRepoSpy.delete.mockRejectedValueOnce(error)
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
    expect(result).toBeUndefined()
  })
})
