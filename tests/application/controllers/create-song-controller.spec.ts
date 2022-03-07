
import { CreateSongController } from '@/application/controllers'
import { ServerError } from '@/application/errors'

import { faker } from '@faker-js/faker'
import * as yup from 'yup'

describe('CreateSongController', () => {
  let sut: CreateSongController
  let createSongSpy: jest.Mock
  let fakeRequest: { userId: string, songName: string, artist: string, album: string }
  let fakeSong: { favoriteId: string, songName: string, artist: string, album: string }

  beforeAll(() => {
    createSongSpy = jest.fn()
    fakeSong = {
      favoriteId: 'any_id',
      album: 'any_album',
      artist: 'any_artist',
      songName: 'any_songName'
    }
    fakeRequest = {
      userId: faker.datatype.uuid(),
      album: 'any_album',
      artist: 'any_artist',
      songName: 'any_songName'
    }
  })

  beforeEach(() => {
    sut = new CreateSongController(createSongSpy)
    createSongSpy.mockResolvedValue(fakeSong)
  })

  test('should return 400 if request is invalid', async () => {
    const resultInvalidUUID = await sut.handler({
      userId: 'invalid_uuid',
      album: 'any_album',
      artist: 'any_artist',
      songName: 'any_songName'
    })
    expect(resultInvalidUUID).toEqual({
      data: new yup.ValidationError('userId must be a valid UUID'),
      statusCode: 400
    })

    const resultMissingAlbum = await sut.handler({
      userId: faker.datatype.uuid(),
      album: '',
      artist: 'any_artist',
      songName: 'any_songName'
    })
    expect(resultMissingAlbum).toEqual({
      data: new yup.ValidationError('album is a required field'),
      statusCode: 400
    })

    const resultMissingArtist = await sut.handler({
      userId: faker.datatype.uuid(),
      album: 'any_album',
      artist: '',
      songName: 'any_songName'
    })
    expect(resultMissingArtist).toEqual({
      data: new yup.ValidationError('artist is a required field'),
      statusCode: 400
    })

    const resultMissingSongName = await sut.handler({
      userId: faker.datatype.uuid(),
      album: 'any_album',
      artist: 'any_artist',
      songName: ''
    })
    expect(resultMissingSongName).toEqual({
      data: new yup.ValidationError('songName is a required field'),
      statusCode: 400
    })
  })

  test('should call CreateSong with correct input', async () => {
    await sut.handler(fakeRequest)
    expect(createSongSpy).toHaveBeenCalledWith(fakeRequest)
    expect(createSongSpy).toHaveBeenCalledTimes(1)
  })

  test('should return 500 on infra error', async () => {
    const error = new Error('infra_error')
    createSongSpy.mockRejectedValueOnce(error)
    const result = await sut.handler(fakeRequest)
    expect(result).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })

  test('should return 201 with valid data', async () => {
    const result = await sut.handler(fakeRequest)
    expect(result).toEqual({
      statusCode: 201,
      data: fakeSong
    })
  })
})
