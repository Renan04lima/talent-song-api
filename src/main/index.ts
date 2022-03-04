import './config/module-alias'
import 'reflect-metadata'
import env from '@/main/config/env'
import app from '@/main/config/app'

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
