
import { badRequest, Controller, HttpResponse, ok, serverError } from '@/application/helpers'
import * as yup from 'yup'

type Request = { userId: string, songName?: string, artist?: string, album?: string }
type Model = Array<{ favoriteId: string, songName: string, artist: string, album: string }>
type GetSongs = (request: Request) => Promise<Model>
export class GetSongsController implements Controller {
  constructor (
    private readonly getSongs: GetSongs
  ) {}

  async handler (req: Request): Promise<HttpResponse> {
    try {
      const error = await this.validate(req)
      if (error != null) return badRequest(error)
      const songs = await this.getSongs(req)

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
