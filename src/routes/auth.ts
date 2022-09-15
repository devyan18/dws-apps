import { Router } from 'express'
import passport from 'passport'
import input from '../middlewares/input.middleware'
import {
  registerSchema,
  loginSchema
} from '../schemas/user.schemas'
import {
  loginCtrl,
  registerCtrl,
  getUserByTokenCtrl
} from '../controllers/auth.controllers'

const router = Router()

router.post('/register', input(registerSchema), registerCtrl)

router.post('/login', input(loginSchema), loginCtrl)

router.get('/token', passport.authenticate('jwt', { session: false }), getUserByTokenCtrl)

export { router }
