import { ILogin, IToken } from 'data/interfaces/IRegistration'
import { IUser } from 'data/interfaces/IUser'
import request from 'utils/request'

export default class UserRepository {
  static async getCurrentUser(): Promise<IUser> {
    const res = await request<IUser>({
      method: 'get',
      url: '/api/auth/currentUser',
    })
    return res
  }

  static async loginByEmailOrPhone(data: ILogin): Promise<IToken|null> {
    const res = await request({
      method: 'post',
      url: '/api/auth/login',
      data
    })
    if(res.err) {
      return null
    }
    return res
  }
}

