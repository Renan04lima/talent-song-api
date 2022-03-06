import { ForbiddenError } from '@/application/errors'
import { AuthMiddleware } from '@/application/middlewares'

describe('AuthMiddleware', () => {
  let sut: AuthMiddleware

  beforeEach(() => {
    sut = new AuthMiddleware()
  })

  test('should return 403 if not have token authorization', async () => {
    const result = await sut.handle({ authorization: '' })

    expect(result).toEqual({
      statusCode: 403,
      data: new ForbiddenError()
    })
  })
})
