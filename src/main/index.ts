import './config/module-alias'
import 'reflect-metadata'
import env from '@/main/config/env'
import app from '@/main/config/app'
import createConnection from '@/infra/repos/postgres/helpers/connection'

createConnection()
  .then(() => {
    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
  }).catch(console.error)
