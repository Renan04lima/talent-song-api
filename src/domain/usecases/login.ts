import { AuthError } from '@/application/errors'
import { HashComparer, TokenGenerator } from '@/domain/contracts/gateways'
import { LoadAccountByEmailRepo } from '@/domain/contracts/repos'

type Input = { email: string, password: string }
type Output = { token: string}
type Setup = (loadAccountByEmailRepo: LoadAccountByEmailRepo, hashComparer: HashComparer, tokenGenerator: TokenGenerator, expirationInMs: number) => Login
export type Login = (input: Input) => Promise<Output>

export const setupLogin: Setup = (loadAccountByEmailRepo, hashComparer, tokenGenerator, expirationInMs) => async ({ email, password }) => {
  const account = await loadAccountByEmailRepo.load({ email })
  if (account == null) {
    throw new AuthError()
  }
  const isValid = await hashComparer.compare(password, account.password)
  if (!isValid) {
    throw new AuthError()
  }
  const token = await tokenGenerator.generate({ key: account.id, expirationInMs })
  return {
    token
  }
}
