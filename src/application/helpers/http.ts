import { ServerError } from '@/application/errors'

export type HttpResponse<T = any> = {
  statusCode: number
  data?: T
}

export interface Controller {
  handler: (request: any) => Promise<HttpResponse>
}

export const ok = <T = any> (data: T): HttpResponse<T> => ({
  statusCode: 200,
  data
})

export const created = <T = any> (data: T): HttpResponse<T> => ({
  statusCode: 201,
  data
})

export const badRequest = (error: unknown): HttpResponse<Error> => ({
  statusCode: 400,
  data: error instanceof Error ? error : undefined
})

export const serverError = (error: unknown): HttpResponse<Error> => ({
  statusCode: 500,
  data: new ServerError(error instanceof Error ? error : undefined)
})
