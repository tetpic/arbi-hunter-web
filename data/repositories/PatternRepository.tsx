import { IPattern, IPatternBase, IPatternRequest, IPatternResponce } from 'data/interfaces/IPattern'
import { PatternTypes } from 'types/enums'
import request from 'utils/request'

export default class PatternRepository {
  static async getPatternByType(data: PatternTypes): Promise<IPattern|null> {
    const res = await request({
      method: 'get',
      url: `/api/cover-letter?type=${data}`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getPatternText(data: IPatternRequest): Promise<IPatternResponce|null> {
    const res = await request({
      method: 'get',
      url: '/api/cover-letter/',
      data,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async createPatternText(data: IPatternBase): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/cover-letter',
      data,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async editPatternById(data: IPatternBase, id: number): Promise<any|null> {
    const res = await request({
      method: 'patch',
      url: `/api/cover-letter/${id}`,
      data,
    })
    if(res.err) {
      return null
    }
    return res
  }
}
