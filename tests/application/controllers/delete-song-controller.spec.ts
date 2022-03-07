
import { DeleteSongController } from '@/application/controllers'
import { ForbiddenError, ServerError, NotBelogsError } from '@/application/errors'

import * as yup from 'yup'
import { faker } from '@faker-js/faker'

describe('DeleteSongController', () => {
  let sut: DeleteSongController
  let deleteSongSpy: jest.Mock
  let fakeRequest: { userId: string, favoriteId: string }

  beforeAll(() => {
    deleteSongSpy = jest.fn()
    fakeRequest = {
      userId: faker.datatype.uuid(),
      favoriteId: faker.datatype.uuid()
    }
  })

  beforeEach(() => {
    sut = new DeleteSongController(deleteSongSpy)
    deleteSongSpy.mockResolvedValue(Promise.resolve())
  })

  test('should return 400 if request is invalid', async () => {
    const resultInvalidUserUUID = await sut.handler({
      userId: 'invalid_uuid',
      favoriteId: faker.datatype.uuid()
    })
    expect(resultInvalidUserUUID).toEqual({
      data: new yup.ValidationError('userId must be a valid UUID'),
      statusCode: 400
    })

    const resultInvalidFavoriteUUID = await sut.handler({
      favoriteId: 'invalid_uuid',
      userId: faker.datatype.uuid()
    })
    expect(resultInvalidFavoriteUUID).toEqual({
      data: new yup.ValidationError('favoriteId must be a valid UUID'),
      statusCode: 400
    })
  })

  test('should call DeleteSong with correct input', async () => {
    await sut.handler(fakeRequest)
    expect(deleteSongSpy).toHaveBeenCalledWith(fakeRequest)
    expect(deleteSongSpy).toHaveBeenCalledTimes(1)
  })

  test('should return 500 on infra error', async () => {
    const error = new Error('infra_error')
    deleteSongSpy.mockRejectedValueOnce(error)
    const result = await sut.handler(fakeRequest)
    expect(result).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })

  test('should return 403 if DeleteSong throw NotBelogsError', async () => {
    const error = new NotBelogsError()
    deleteSongSpy.mockRejectedValueOnce(error)
    const result = await sut.handler(fakeRequest)
    expect(result).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  test('should return 204 on success', async () => {
    const result = await sut.handler(fakeRequest)
    expect(result).toEqual({
      statusCode: 204
    })
  })
})
