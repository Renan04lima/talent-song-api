
import { badRequest, Controller, HttpResponse, serverError, forbidden, noContent } from '@/application/helpers'
import { NotBelogsError } from '@/application/errors'
import { DeleteSong } from '@/domain/usecases'
import * as yup from 'yup'

type Request = { userId: string, favoriteId: string}

export class DeleteSongController implements Controller {
  constructor (
    private readonly deleteSong: DeleteSong
  ) {}

  async handler (req: Request): Promise<HttpResponse> {
    try {
      const error = await this.validate(req)
      if (error != null) return badRequest(error)
      await this.deleteSong(req)

      return noContent()
    } catch (error) {
      if (error instanceof NotBelogsError) { return forbidden() }
      return serverError(error)
    }
  }

  private async validate (request: Request): Promise<unknown | undefined> {
    const schema: yup.SchemaOf<Request> = yup.object().shape({
      userId: yup.string().uuid().required(),
      favoriteId: yup.string().uuid().required()
    })

    try {
      await schema.validate(request, { stripUnknown: true })
      return undefined
    } catch (error) {
      return error
    }
  }
}
