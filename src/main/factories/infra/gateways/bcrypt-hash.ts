import { BcryptHash } from '@/infra/gateways'

export const makeBcryptHash = (): BcryptHash => {
  return new BcryptHash()
}
