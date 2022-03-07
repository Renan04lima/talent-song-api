
import { badRequest, Controller, created, HttpResponse, serverError } from '@/application/helpers'
import * as yup from 'yup'

type Request = { userId: string, songName: string, artist: string, album: string }
type Model = { favoriteId: string, songName: string, artist: string, album: string }
type CreateSong = (request: Request) => Promise<Model>
export class CreateSongController implements Controller {
  constructor (
    private readonly createSong: CreateSong
  ) {}

  async handler (req: Request): Promise<HttpResponse> {
    try {
      const error = await this.validate(req)
      if (error != null) return badRequest(error)
      const song = await this.createSong(req)

      return created(song)
    } catch (error) {
      return serverError(error)
    }
  }

  private async validate (request: Request): Promise<unknown | undefined> {
    const schema: yup.SchemaOf<Request> = yup.object().shape({
      userId: yup.string().uuid().required(),
      album: yup.string().required(),
      artist: yup.string().required(),
      songName: yup.string().required()
    })

    try {
      await schema.validate(request, { stripUnknown: true })
      return undefined
    } catch (error) {
      return error
    }
  }
}
