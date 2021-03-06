import { ForbiddenError } from '@/application/errors'
import { AuthMiddleware } from '@/application/middlewares'

describe('AuthMiddleware', () => {
  let sut: AuthMiddleware
  let authorizeSpy: jest.Mock
  let authorization: string

  beforeAll(() => {
    authorization = 'any_authorization_token'
    authorizeSpy = jest.fn().mockResolvedValue('any_user_id')
  })

  beforeEach(() => {
    sut = new AuthMiddleware(authorizeSpy)
  })

  test('should return 403 if not have token authorization', async () => {
    const result = await sut.handle({ authorization: '' })

    expect(result).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  test('should call Authorize with correct input', async () => {
    await sut.handle({ authorization })

    expect(authorizeSpy).toHaveBeenCalledWith({
      token: authorization
    })
  })

  test('should return 403 if Authorize throws', async () => {
    authorizeSpy.mockRejectedValueOnce(new Error())
    const result = await sut.handle({ authorization })

    expect(result).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })

  test('should return 200 with userId on success', async () => {
    const httpResponse = await sut.handle({ authorization })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { userId: 'any_user_id' }
    })
  })
})
