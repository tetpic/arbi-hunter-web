import { IPattern, IPatternBase, IPatternRequest, IPatternResponce } from 'data/interfaces/IPattern'
import { ProfileType } from 'data/interfaces/IRegistration'
import { PatternTypes } from 'types/enums'
import request from 'utils/request'

export default class PatternRepository {
  static async getPatternByType(data: PatternTypes, profile: ProfileType): Promise<IPattern|null> {
    const res = await request({
      method: 'get',
      url: `/api/cover-letter?type=${data}`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getPatternText(data: IPatternRequest, profile: ProfileType): Promise<IPatternResponce|null> {
    const res = await request({
      method: 'get',
      url: `/api/cover-letter/`,
      data,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async createPatternText(data: IPatternBase, profile: ProfileType): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: `/api/cover-letter`,
      data,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }
}
