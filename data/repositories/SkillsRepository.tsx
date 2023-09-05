
import { ISource } from 'data/interfaces/Common'
import request from 'utils/request'

export default class SkillsRepository {
  static async findSkill(data: string): Promise<{data: ISource[]}|null> {
    const res = await request({
      method: 'get',
      url: `/api/skill?search=${data}`,
    })
    if(res.err) {
      return null
    }
    return res
  }
  
  static async createSkill(data: {title: string}): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: `/api/skill`,
      data
    })
    if(res.err) {
      return null
    }
    return res
  }
}
