
import { UpdateSongController } from '@/application/controllers'
import { ServerError } from '@/application/errors'

import * as yup from 'yup'
import { faker } from '@faker-js/faker'

describe('UpdateSongController', () => {
  let sut: UpdateSongController
  let updateSongSpy: jest.Mock
  let fakeRequest: { userId: string, favoriteId: string, songName?: string, artist?: string, album?: string }
  let fakeSong: { songName: string, artist: string, album: string}

  beforeAll(() => {
    updateSongSpy = jest.fn()
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
    sut = new UpdateSongController(updateSongSpy)
    updateSongSpy.mockResolvedValue(fakeSong)
  })

  test('should return 400 if request is invalid', async () => {
    const resultInvalidUserUUID = await sut.handler({
      userId: 'invalid_uuid',
      favoriteId: faker.datatype.uuid(),
      album: 'any_album',
      artist: 'any_artist',
      songName: 'any_songName'
    })
    expect(resultInvalidUserUUID).toEqual({
      data: new yup.ValidationError('userId must be a valid UUID'),
      statusCode: 400
    })

    const resultInvalidFavoriteUUID = await sut.handler({
      favoriteId: 'invalid_uuid',
      userId: faker.datatype.uuid(),
      album: 'any_album',
      artist: 'any_artist',
      songName: 'any_songName'
    })
    expect(resultInvalidFavoriteUUID).toEqual({
      data: new yup.ValidationError('favoriteId must be a valid UUID'),
      statusCode: 400
    })
  })

  test('should call UpdateSong with correct input', async () => {
    await sut.handler(fakeRequest)
    expect(updateSongSpy).toHaveBeenCalledWith(fakeRequest)
    expect(updateSongSpy).toHaveBeenCalledTimes(1)
  })

  test('should return 500 on infra error', async () => {
    const error = new Error('infra_error')
    updateSongSpy.mockRejectedValueOnce(error)
    const result = await sut.handler(fakeRequest)
    expect(result).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })

  test('should return 200 with valid data', async () => {
    const result = await sut.handler(fakeRequest)
    expect(result).toEqual({
      statusCode: 200,
      data: fakeSong
    })
  })
})
