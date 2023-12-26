import { ILogin, IToken, ProfileType } from 'data/interfaces/IRegistration'
import { IStats, IUser, IUserProfile } from 'data/interfaces/IUser'
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

  static async getStats(): Promise<IStats|null> {
    const res = await request({
      method: 'get',
      url: '/api/stats',
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async passwordChangeConfirmation(data: {newPassword: string}): Promise<IToken|null> {
    const res = await request({
      method: 'post',
      url: '/api/auth/passwordChangeConfirmation',
      data
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async editProfileByType(data: any, profile?: ProfileType): Promise<IUserProfile|null> {
    const res = await request({
      method: 'post',
      url: `/api/profile/${profile}`,
      data
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getUserProfileById(id: number): Promise<IUserProfile|null> {
    const res = await request({
      method: 'get',
      url: `/api/profile/${id}`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async removeCurrentUserByType(profile: ProfileType): Promise<any|null> {
    const res = await request({
      method: 'delete',
      url: `/api/profile/${profile}`,
    })
    if(res.err) {
      return null
    }
    return res
  }


  
  static async getBackgrounds(data?: {profileId?: number, categoryId?: number, lang?: string}): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: '/api/background',
      data
    })
    if(res.err) {
      return null
    }
    return res
  }
}

