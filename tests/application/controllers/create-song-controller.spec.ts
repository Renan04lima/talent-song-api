
import * as yup from 'yup'
import { mock, MockProxy } from 'jest-mock-extended'
import { CreateSong } from '@/domain/usecases'
import { CreateSongController } from '@/application/controllers'
import { faker } from '@faker-js/faker'
import { ServerError } from '@/application/errors'

describe('CreateSongController', () => {
  let sut: CreateSongController
  let createSongSpy: MockProxy<CreateSong>
  let fakeRequest: CreateSongController.Input
  let fakeSong: CreateSong.Output

  beforeAll(() => {
    createSongSpy = mock()
    sut = new CreateSongController(createSongSpy)
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
    createSongSpy.create.mockResolvedValue(fakeSong)
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
    expect(createSongSpy.create).toHaveBeenCalledWith(fakeRequest)
    expect(createSongSpy.create).toHaveBeenCalledTimes(1)
  })

  test('should return 500 on infra error', async () => {
    const error = new Error('infra_error')
    createSongSpy.create.mockRejectedValueOnce(error)
    const result = await sut.handler(fakeRequest)
    expect(result).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })
})
