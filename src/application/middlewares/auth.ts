import { forbidden } from '@/application/helpers'
import { Middleware } from '@/application/middlewares'
import * as yup from 'yup'

type Request = { authorization: string }
type Authorize = (input: { token: string }) => Promise<string>

export class AuthMiddleware implements Middleware {
  constructor (private readonly authorize: Authorize) {}

  async handle ({ authorization }: Request): Promise<any> {
    const error = await this.validate({ authorization })
    if (error != null) return forbidden()
    await this.authorize({ token: authorization })
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
