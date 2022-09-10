import { sign } from 'jsonwebtoken'
import environments from '../config/environments'

export const createJwt = (userId: string) => {
  const payload = { userId }

  const token = sign(payload, environments.JWT_SECRET)

  return token
}
