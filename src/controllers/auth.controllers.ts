import { Request, Response } from 'express'
import { User } from '../entities/user.entity'
import httpErrorHandler from '../handlers/http_error.handler'
import AuthServices from '../services/auth.services'

const authServices = new AuthServices()

const loginCtrl = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const token = await authServices.loginUser(email, password)

    res.status(203).json({
      token
    })
  } catch (error) {
    httpErrorHandler(new Error('Error credentials'), res, 403)
  }
}

const registerCtrl = async (req: Request, res: Response) => {
  try {
    const token = await authServices.registerUser(req.body as User)

    res.status(203).json({
      token
    })
  } catch (error) {
    console.log(error)
    httpErrorHandler(new Error('Unexpected Error'), res, 500)
  }
}

export { loginCtrl, registerCtrl }
