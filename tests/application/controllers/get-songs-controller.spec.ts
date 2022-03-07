
import { GetSongsController } from '@/application/controllers'
import { ServerError } from '@/application/errors'

import * as yup from 'yup'
import { faker } from '@faker-js/faker'

describe('GetSongsController', () => {
  let sut: GetSongsController
  let getSongsSpy: jest.Mock
  let fakeRequest: { userId: string, songName?: string, artist?: string, album?: string }
  let fakeSongs: Array<{ favoriteId: string, songName: string, artist: string, album: string }>

  beforeAll(() => {
    getSongsSpy = jest.fn()
    fakeSongs = [{
      favoriteId: 'any_id',
      album: 'any_album',
      artist: 'any_artist',
      songName: 'any_songName'
    }]
    fakeRequest = {
      userId: faker.datatype.uuid(),
      album: 'any_album',
      artist: 'any_artist',
      songName: 'any_songName'
    }
  })

  beforeEach(() => {
    sut = new GetSongsController(getSongsSpy)
    getSongsSpy.mockResolvedValue(fakeSongs)
  })

  test('should return 400 if request is invalid', async () => {
    const resultInvalidUUID = await sut.handler({
      userId: 'invalid_uuid'
    })
    expect(resultInvalidUUID).toEqual({
      data: new yup.ValidationError('userId must be a valid UUID'),
      statusCode: 400
    })
  })

  test('should call GetSongs with corrects inputs', async () => {
    const onlyUserId = {
      userId: faker.datatype.uuid()
    }
    await sut.handler(onlyUserId)
    expect(getSongsSpy).toHaveBeenCalledWith(onlyUserId)

    const withAlbum = {
      album: 'any_album',
      userId: faker.datatype.uuid()
    }
    await sut.handler(withAlbum)
    expect(getSongsSpy).toHaveBeenCalledWith(withAlbum)

    const withArtist = {
      artist: 'any_artist',
      userId: faker.datatype.uuid()
    }
    await sut.handler(withArtist)
    expect(getSongsSpy).toHaveBeenCalledWith(withArtist)

    const withSongName = {
      songName: 'any_songName',
      userId: faker.datatype.uuid()
    }
    await sut.handler(withSongName)
    expect(getSongsSpy).toHaveBeenCalledWith(withSongName)

    await sut.handler(fakeRequest)
    expect(getSongsSpy).toHaveBeenCalledWith(fakeRequest)
  })

  test('should return 500 on infra error', async () => {
    const error = new Error('infra_error')
    getSongsSpy.mockRejectedValueOnce(error)
    const result = await sut.handler(fakeRequest)
    expect(result).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })

  test('should return 204 if GetSongs return a empty array', async () => {
    getSongsSpy.mockResolvedValueOnce([])
    const result = await sut.handler(fakeRequest)
    expect(result).toEqual({
      statusCode: 204
    })
  })

  test('should return 200 with valid data', async () => {
    const result = await sut.handler(fakeRequest)
    expect(result).toEqual({
      statusCode: 200,
      data: fakeSongs
    })
  })
})
