import { get } from 'env-var'

export default {
  port: get('PORT').default(5050).asPortNumber(),
  jwtSecret: get('JWT_SECRET').default('ASDFHKA').asString()
}
