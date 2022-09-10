import { Router } from 'express'
import { loginCtrl, registerCtrl } from '../controllers/auth.controllers'
import input from '../middlewares/input.middleware'
import { registerSchema, loginSchema } from '../schemas/user.schemas'

const router = Router()

router.post('/register', input(registerSchema), registerCtrl)
router.post('/login', input(loginSchema), loginCtrl)

export { router }
