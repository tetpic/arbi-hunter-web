import { ILogin, IToken, ProfileType } from 'data/interfaces/IRegistration'
import { IUser, IUserProfile } from 'data/interfaces/IUser'
import request from 'utils/request'

export default class UserRepository {
  static async getCurrentUser(token?: string): Promise<IUser> {
    const res = await request<IUser>({
      method: 'get',
      url: '/api/auth/currentUser',
      token
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


  static async passwordChangeConfirmation(data: {newPassword: string}): Promise<IToken|null> {
    const res = await request({
      method: 'post',
      url: `/api/auth/passwordChangeConfirmation`,
      data
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async editProfileByType(data: any, profileType: ProfileType): Promise<IUserProfile|null> {
    const res = await request({
      method: 'post',
      url: `/api/profile/${profileType}`,
      data
    })
    if(res.err) {
      return null
    }
    return res
  }
}

