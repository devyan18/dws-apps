import { Document, model, Schema } from 'mongoose'
import bcryptjs from 'bcryptjs'

import { User } from '../entities/user.entity'

const SALT_WORK_FACTOR = 10

export interface IUserModel extends User, Document {
  comparePassword: (password: string) => Promise<boolean>
}

const UserSchema = new Schema<IUserModel>({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  fullName: {
    type: String
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  avatar: {
    type: String
  },
  sexo: {
    type: String,
    enum: ['male', 'female'],
    default: 'male'
  },
  premium: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
},
{
  timestamps: true,
  versionKey: false
})

UserSchema.pre<IUserModel>('save', async function (next) {
  const user = this

  if (!user.isModified(['lastName', 'firstName', 'password'])) return next()

  if (user.isModified('password')) {
    const salt = await bcryptjs.genSalt(SALT_WORK_FACTOR)
    const hash = await bcryptjs.hash(user.password, salt)
    user.password = hash
  }

  if (user.isModified(['firstName', 'lastName'])) {
    user.fullName = `${user.firstName} ${user.lastName}`
  }

  next()
})

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcryptjs.compare(password, this.password)
}

export default model<IUserModel>('User', UserSchema)
