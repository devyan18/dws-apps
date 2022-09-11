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
      const zodErrors = error.issues.map((issue) => issue.message)
      console.log(zodErrors)
      return res.status(406).json(zodErrors)
    }
    return httpErrorHandler(new Error('unexpected error'), res, 500)
  }
}

export default input
