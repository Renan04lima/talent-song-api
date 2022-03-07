import { TokenGenerator, TokenValidator } from '@/domain/contracts/gateways'

import { JwtPayload, verify, sign } from 'jsonwebtoken'

export class JwtTokenHandler implements TokenValidator, TokenGenerator {
  constructor (private readonly secret: string) {}

  async validate ({ token }: TokenValidator.Input): Promise<TokenValidator.Output> {
    const payload = verify(token, this.secret) as JwtPayload
    return payload.key
  }

  async generate ({ expirationInMs, key }: TokenGenerator.Input): Promise<TokenGenerator.Output> {
    const expirationInSeconds = expirationInMs / 1000
    return sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }
}
