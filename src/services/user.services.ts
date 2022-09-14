import { User } from '../entities/user.entity'
import UserModel from '../models/user.model'

class UserServices {
  getAllUsers = async () => {
    const users = await UserModel.find()
    return users
  }

  getUserByUId = async (userId: string) => {
    const user = await UserModel.findById(userId)
    if (!user) {
      return null
    }
    return user
  }

  createUser = async (props: User) => {
    const user = new UserModel(props)
    await user.save()
    return user
  }

  editUser = async (userId: string, props: Partial<User>) => {
    const user = await UserModel.findByIdAndUpdate(userId, props, { new: true })
    return user
  }

  deactiveUser = async (userId: string) => {
    try {
      const user = await UserModel.findByIdAndUpdate(userId, { isActive: false }, { new: true })
      return user
    } catch (error) {
      return null
    }
  }
}

export default UserServices
