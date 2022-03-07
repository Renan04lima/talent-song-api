
import { Controller } from '@/application/helpers'
import { RequestHandler } from 'express'

type Adapter = (controller: Controller) => RequestHandler

export const adaptExpressRoute: Adapter = controller => async (req, res) => {
  const { statusCode, data } = await controller.handler({ ...req.body, ...req.params, ...req.query, ...req.locals })
  const json = [200, 201, 204].includes(statusCode) ? data : { error: data.message }
  res.status(statusCode).json(json)
}
