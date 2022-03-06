import { forbidden, ok } from '@/application/helpers'
import { Middleware } from '@/application/middlewares'
import * as yup from 'yup'

type Request = { authorization: string }
type Authorize = (input: { token: string }) => Promise<string>

export class AuthMiddleware implements Middleware {
  constructor (private readonly authorize: Authorize) {}

  async handle ({ authorization }: Request): Promise<any> {
    try {
      const error = await this.validate({ authorization })
      if (error != null) return forbidden()
      const userId = await this.authorize({ token: authorization })

      return ok({ userId })
    } catch (error) {
      return forbidden()
    }
  }

  private async validate (request: Request): Promise<unknown | undefined> {
    const schema: yup.SchemaOf<Request> = yup.object().shape({
      authorization: yup.string().required()
    })

    try {
      await schema.validate(request, { stripUnknown: true })
      return undefined
    } catch (error) {
      return error
    }
  }
}
