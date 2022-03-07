
import { LoadAccountByEmailRepo } from '@/domain/contracts/repos'
import { HashComparer, TokenGenerator } from '@/domain/contracts/gateways'
import { setupLogin, Login } from '@/domain/usecases'
import { AuthError } from '@/application/errors'

import { MockProxy, mock } from 'jest-mock-extended'

describe('Login', () => {
  let sut: Login
  let loadAccountByEmailRepoSpy: MockProxy<LoadAccountByEmailRepo>
  let hashCompareSpy: MockProxy<HashComparer>
  let tokenGeneratorSpy: MockProxy<TokenGenerator>
  let fakeRequest: { email: string, password: string}
  let fakeAccount: { id: string, password: string}

  beforeAll(() => {
    loadAccountByEmailRepoSpy = mock()
    hashCompareSpy = mock()
    tokenGeneratorSpy = mock()

    fakeRequest = {
      email: 'any_email',
      password: 'any_password'
    }
    fakeAccount = {
      id: 'any_id',
      password: 'any_password'
    }
  })

  beforeEach(() => {
    sut = setupLogin(loadAccountByEmailRepoSpy, hashCompareSpy, tokenGeneratorSpy, 60)
    loadAccountByEmailRepoSpy.load.mockResolvedValue(fakeAccount)
    hashCompareSpy.compare.mockResolvedValue(true)
    tokenGeneratorSpy.generate.mockResolvedValue('any_token')
  })

  test('should call LoadAccountByEmailRepo with correct input', async () => {
    await sut(fakeRequest)
    expect(loadAccountByEmailRepoSpy.load).toHaveBeenCalledWith({ email: fakeRequest.email })
    expect(loadAccountByEmailRepoSpy.load).toHaveBeenCalledTimes(1)
  })

  test('should call HashComparer with correct input', async () => {
    await sut(fakeRequest)
    expect(hashCompareSpy.compare).toHaveBeenCalledWith(fakeRequest.password, fakeAccount.password)
    expect(hashCompareSpy.compare).toHaveBeenCalledTimes(1)
  })

  test('should call TokenGenerator with correct input', async () => {
    await sut(fakeRequest)
    expect(tokenGeneratorSpy.generate).toHaveBeenCalledWith(
      { key: fakeAccount.id, expirationInMs: 60 }
    )
    expect(tokenGeneratorSpy.generate).toHaveBeenCalledTimes(1)
  })

  test('should rethrow if HashComparer throw', async () => {
    const error = new Error('infra_error')
    hashCompareSpy.compare.mockRejectedValueOnce(error)
    const promise = sut(fakeRequest)
    await expect(promise).rejects.toThrow(error)
  })

  test('should rethrow if LoadAccountByEmailRepo throw', async () => {
    const error = new Error('infra_error')
    loadAccountByEmailRepoSpy.load.mockRejectedValueOnce(error)
    const promise = sut(fakeRequest)
    await expect(promise).rejects.toThrow(error)
  })

  test('should throw AuthError if LoadAccountByEmailRepo return null', async () => {
    loadAccountByEmailRepoSpy.load.mockResolvedValueOnce(undefined)
    const promise = sut(fakeRequest)
    await expect(promise).rejects.toThrow(new AuthError())
  })

  test('should throw AuthError if HashComparer return false', async () => {
    hashCompareSpy.compare.mockResolvedValueOnce(false)
    const promise = sut(fakeRequest)
    await expect(promise).rejects.toThrow(new AuthError())
  })

  test('should return valid data on success', async () => {
    const result = await sut(fakeRequest)
    expect(result).toEqual({ token: 'any_token' })
  })
})
