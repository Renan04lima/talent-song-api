import { TokenValidator } from '@/domain/gateways'

import { JwtPayload, verify } from 'jsonwebtoken'

export class JwtTokenHandler implements TokenValidator {
  constructor (private readonly secret: string) {}

  async validate ({ token }: TokenValidator.Input): Promise<TokenValidator.Output> {
    const payload = verify(token, this.secret) as JwtPayload
    return payload.key
  }
}
