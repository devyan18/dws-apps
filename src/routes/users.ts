import { Router } from 'express'
import {
  createUserCtrl,
  deleteUserCtrl,
  editUserCtrl,
  getUserCtrl,
  getUsersCtrl
} from '../controllers/users.controllers'
import input from '../middlewares/input.middleware'
import { registerSchema } from '../schemas/user.schemas'

const router = Router()

router.get('/', getUsersCtrl)
router.get('/:userId', getUserCtrl)
router.post('/', input(registerSchema), createUserCtrl)
router.put('/:userId', editUserCtrl)
router.delete('/:userId', deleteUserCtrl)

export { router }
