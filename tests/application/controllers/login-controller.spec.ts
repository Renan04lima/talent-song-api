
import { LoginController } from '@/application/controllers'
import { ServerError, AuthError, UnauthorizedError } from '@/application/errors'

describe('LoginController', () => {
  let sut: LoginController
  let loginSpy: jest.Mock
  let fakeRequest: { email: string, password: string }
  let token: string

  beforeAll(() => {
    loginSpy = jest.fn()
    token = 'any_token'
    fakeRequest = {
      email: 'any_email',
      password: 'any_password'
    }
  })

  beforeEach(() => {
    sut = new LoginController(loginSpy)
    loginSpy.mockResolvedValue({ token })
  })

  test('should call Login with correct input', async () => {
    await sut.handler(fakeRequest)
    expect(loginSpy).toHaveBeenCalledWith(fakeRequest)
    expect(loginSpy).toHaveBeenCalledTimes(1)
  })

  test('should return 500 on infra error', async () => {
    const error = new Error('infra_error')
    loginSpy.mockRejectedValueOnce(error)
    const result = await sut.handler(fakeRequest)
    expect(result).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })

  test('should return 401 if Login throw AuthError', async () => {
    const error = new AuthError()
    loginSpy.mockRejectedValueOnce(error)
    const result = await sut.handler(fakeRequest)
    expect(result).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  test('should return 200 with valid data', async () => {
    const result = await sut.handler(fakeRequest)
    expect(result).toEqual({
      statusCode: 200,
      data: { token }
    })
  })
})
