
import { badRequest, Controller, HttpResponse, serverError, ok, forbidden } from '@/application/helpers'
import { NotBelogsError } from '@/application/errors'
import { UpdateSong } from '@/domain/usecases'
import * as yup from 'yup'

type Request = { userId: string, favoriteId: string, songName?: string, artist?: string, album?: string }

export class UpdateSongController implements Controller {
  constructor (
    private readonly updateSong: UpdateSong
  ) {}

  async handler (req: Request): Promise<HttpResponse> {
    try {
      const error = await this.validate(req)
      if (error != null) return badRequest(error)
      const song = await this.updateSong(req)

      return ok(song)
    } catch (error) {
      if (error instanceof NotBelogsError) { return forbidden() }
      return serverError(error)
    }
  }

  private async validate (request: Request): Promise<unknown | undefined> {
    const schema: yup.SchemaOf<Request> = yup.object().shape({
      userId: yup.string().uuid().required(),
      favoriteId: yup.string().uuid().required(),
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
