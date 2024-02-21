import { BackgroundCategoryType, IBackground } from 'data/interfaces/IBackground'
import { ProfileType } from 'data/interfaces/IRegistration'
import request from 'utils/request'


export default class BackgroundRepository {

  static async getBackground(data?: {profileId?: number, categoryId?: BackgroundCategoryType}): Promise<IBackground[]|[]> {
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

  static async setBackgrounds(data: {backgroundsIds: number[]}, profile: ProfileType): Promise<any|null> {
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

  static async createBackground(data: {imageId?: number, categoryId?: BackgroundCategoryType, profileType?: ProfileType, backgroundType?: 'png'|'rive', riveKeys?: string[]}): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/background',
      data
    })
    if(res.err) {
      return null
    }
    return res
  }
}