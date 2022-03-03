
import { badRequest, Controller, created, HttpResponse, serverError } from '@/application/helpers'
import { CreateSong } from '@/domain/usecases'
import * as yup from 'yup'

type Request = CreateSongController.Input

export class CreateSongController implements Controller {
  constructor (
    private readonly createSong: CreateSong
  ) {}

  async handler (req: Request): Promise<HttpResponse> {
    try {
      const error = await this.validate(req)
      if (error != null) {
        return badRequest(error)
      }

      return created({})
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

export namespace CreateSongController {
  export type Input = CreateSong.Input
}
