import { PgUsers } from '@/infra/repos/postgres/entities'
import { hash } from 'bcrypt'
import getConnection from '../helpers/connection'

async function create (): Promise<void> {
  const connection = await getConnection()

  await connection.createQueryBuilder().insert().into(PgUsers).values([
    {
      email: 'user@email.com.br',
      password: await hash('123', 12)
    }
  ]).execute()

  await connection.close()

  return await Promise.resolve()
}

create().then(() => console.log('User created!')).catch(error => console.log(error))
