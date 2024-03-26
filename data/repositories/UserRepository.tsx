import { ILogin, IToken, ProfileType } from 'data/interfaces/IRegistration'
import { IStats, IUser, IUserProfile } from 'data/interfaces/IUser'
import { IPagination } from 'types/types'
import request from 'utils/request'

export default class UserRepository {
  static async getCurrentUser(token?: string): Promise<IUser> {
    const res = await request({
      method: 'get',
      url: '/api/auth/currentUser',
      token
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async editCurrentUser(data: Pick<IUser, 'email'|'phone'>): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/auth/currentUser',
      data
    })
    if(res.err) {
      return null
    }
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

  static async getBlackListedProfiles(): Promise<IPagination<IUserProfile>|null> {
    const res = await request({
      method: 'get',
      url: '/api/profile/blackList',
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

  static async passwordChangeConfirmation(data: {newPassword?: string, oldPassword?: string}): Promise<IToken|null> {
    const res = await request({
      method: 'post',
      url: '/api/auth/resetPassByCurrentUser',
      data
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async editProfileByType(data: Partial<IUserProfile>, profile?: ProfileType): Promise<IUserProfile|null> {
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

