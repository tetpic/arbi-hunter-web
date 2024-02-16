import { ISource } from 'data/interfaces/Common'
import { IPagination } from 'types/types'
import request from 'utils/request'

export default class SourceRepository {

  static async getVerticals(): Promise<IPagination<ISource>|null> {
    const res = await request({
      method: 'get',
      url: '/api/vertical',
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getGeos(): Promise<IPagination<ISource>|null> {
    const res = await request({
      method: 'get',
      url: '/api/geo',
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async sourcesList(): Promise<IPagination<ISource>|null> {
    const res = await request({
      method: 'get',
      url: '/api/source',
    })
    if(res.err) {
      return null
    }
    return res
  }
}
