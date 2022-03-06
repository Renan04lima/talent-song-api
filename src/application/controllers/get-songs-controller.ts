
import { badRequest, Controller, HttpResponse, ok, serverError } from '@/application/helpers'
import { GetSongs } from '@/domain/usecases'
import * as yup from 'yup'

type Request = GetSongsController.Input

export class GetSongsController implements Controller {
  constructor (
    private readonly getSongs: GetSongs
  ) {}

  async handler (req: Request): Promise<HttpResponse> {
    try {
      const error = await this.validate(req)
      if (error != null) {
        return badRequest(error)
      }

      const songs = await this.getSongs.get(req)

      return ok(songs)
    } catch (error) {
      return serverError(error)
    }
  }

  private async validate (request: Request): Promise<unknown | undefined> {
    const schema: yup.SchemaOf<Request> = yup.object().shape({
      userId: yup.string().uuid().required(),
      album: yup.string().optional(),
      artist: yup.string().optional(),
      songName: yup.string().optional()
    })

    try {
      await schema.validate(request, { stripUnknown: true })
      return undefined
    } catch (error) {
      return error
    }
  }
}

export namespace GetSongsController {
  export type Input = GetSongs.Input
}
