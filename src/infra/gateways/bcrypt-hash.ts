
import { HashComparer } from '@/domain/contracts/gateways'
import bcrypt from 'bcrypt'

export class BcryptHash implements HashComparer {
  async compare (plaintext: string, digest: string): Promise<boolean> {
    return bcrypt.compare(plaintext, digest)
  }
}
