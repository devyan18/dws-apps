import { Response } from 'express'

const httpErrorHandler = (err: Error, res: Response, status: number) => {
  return res.status(status).json({
    message: err.message
  })
}

export default httpErrorHandler
