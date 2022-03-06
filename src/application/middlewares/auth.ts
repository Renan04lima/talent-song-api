import { forbidden } from '@/application/helpers'
import { Middleware } from '@/application/middlewares'
import * as yup from 'yup'

type Request = { authorization: string }

export class AuthMiddleware implements Middleware {
  async handle (req: Request): Promise<any> {
    const error = await this.validate(req)
    if (error != null) return forbidden()
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
