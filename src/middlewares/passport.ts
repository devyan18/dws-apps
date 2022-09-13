import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt'
import userModel, { IUserModel } from '../models/user.model'

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

export default new Strategy(opts, async (payload, done) => {
  try {
    const user = await userModel.findById(payload.userId)

    if (user) {
      return done(null, user as IUserModel)
    }

    return done(null, false)
  } catch (error) {
    console.log(error)
    done(error, false)
  }
})
