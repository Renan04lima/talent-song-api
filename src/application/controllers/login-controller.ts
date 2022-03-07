
import { badRequest, Controller, HttpResponse, serverError, ok, unauthorized } from '@/application/helpers'
import { AuthError } from '@/application/errors'
import { Login } from '@/domain/usecases'
import * as yup from 'yup'

type Request = { email: string, password: string }

export class LoginController implements Controller {
  constructor (
    private readonly auth: Login
  ) {}

  async handler (req: Request): Promise<HttpResponse> {
    try {
      const error = await this.validate(req)
      if (error != null) { return badRequest(error) }
      const result = await this.auth(req)

      return ok(result)
    } catch (error) {
      if (error instanceof AuthError) { return unauthorized() }
      return serverError(error)
    }
  }

  private async validate (request: Request): Promise<unknown | undefined> {
    const schema: yup.SchemaOf<Request> = yup.object().shape({
      email: yup.string().required(),
      password: yup.string().required()
    })

    try {
      await schema.validate(request, { stripUnknown: true })
      return undefined
    } catch (error) {
      return error
    }
  }
}
