
import { ISource } from 'data/interfaces/Common'
import { IPagination } from 'types/types'
import request from 'utils/request'

export default class SkillsRepository {
  static async findSkill(data?: string, page?: number, limit: number = 50): Promise<IPagination<ISource>|null> {
    const res = await request({
      method: 'get',
      url: `/api/skill?${data?'&search='+data:''}${page?'&page='+page: ''}&limit=${limit}`,
    })
    if(res.err) {
      return null
    }
    return res
  }
  
  static async createSkill(data: {title: string}): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/skill',
      data
    })
    if(res.err) {
      return null
    }
    return res
  }
}
