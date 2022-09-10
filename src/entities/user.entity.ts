export interface User{
  firstName: string
  lastName: string
  fullName: string
  username: string
  password: string
  email: string
  avatar: string
  sexo: 'male' | 'female'
  premium: boolean
  isActive: boolean
}
