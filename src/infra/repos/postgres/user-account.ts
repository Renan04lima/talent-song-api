import { LoadAccountByEmailRepo } from '@/domain/contracts/repos'
import { PgUsers } from '@/infra/repos/postgres/entities'
import { getRepository } from 'typeorm'

export class PgUserAccountRepo implements LoadAccountByEmailRepo {
  async load ({ email }: LoadAccountByEmailRepo.Input): Promise<LoadAccountByEmailRepo.Output> {
    const repo = getRepository(PgUsers)
    const user = await repo.findOne({ where: { email } })
    return (user != null)
      ? {
          id: user.id,
          password: user.password
        }
      : undefined
  }
}
