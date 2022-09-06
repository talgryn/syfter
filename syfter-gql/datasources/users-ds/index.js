import Account from './models/account.js'
import JWT from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const jwtSign = async (username, name, _id) => {
  return JWT.sign({username, name, _id}, 
    process.env.JWT_SECRET, 
    {
      expiresIn: process.env.TOKEN_EXPIRATION_TIME || "2h"
    }
  )

}
export default class Users {

  async registerUser(username, name, password) {
    const user = await Account.register(new Account({username, name}), password)
    return {token: await jwtSign(username, name, user._id), user}
  }
  async loginUser(username, password) {
    const {user, error } =  await Account.authenticate()(username, password)
    if (error) {
      throw new Error(error)
    }
    return {token: await jwtSign(username, user.name, user._id), user}
  }

  async getUser(username) {
    return await Account.findOne({username})
  }

  async getUserById(_id) {
    return await Account.findById(_id)
  }
}