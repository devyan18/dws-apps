import { Response, Request, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'
import httpErrorHandler from '../handlers/http_error.handler'

const input = (schema: AnyZodObject) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    schema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(406).json(error.issues.map((issue) => issue.message))
    }
    return httpErrorHandler(new Error('unexpected error'), res, 500)
  }
}

export default input
