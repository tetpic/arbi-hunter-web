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
}

