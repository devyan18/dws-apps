import { User } from '../entities/user.entity'
import UserModel from '../models/user.model'
import { createJwt } from '../utils/createJwt'
import UserServices from './user.services'

const userServices = new UserServices()

class AuthServices {
  async loginUser (email: string, password: string) {
    const user = await UserModel.findOne({ email })

    if (!user) {
      throw new Error('User not found')
    }

    if (user.isActive === false) {
      throw new Error('User is not active')
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      throw new Error('Incorrect Credentials')
    }

    const userId = user._id
    const token = createJwt(userId)

    return token
  }

  async registerUser (props: User) {
    const { email, username } = props

    const user = await UserModel.findOne({ $or: [{ email }, { username }] })

    if (user) {
      throw new Error('User already exists')
    }

    const newUser = await userServices.createUser(props)
    const userId = newUser._id

    const token = createJwt(userId)

    return token
  }
}

export default AuthServices
