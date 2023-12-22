import { IPersonalPage, IPersonalPageBlock } from 'data/interfaces/IPersonal'
import request from 'utils/request'

export default class PersonalRepository {
  static async getPersonalPage(): Promise<IPersonalPage> {
    const res = await request({
      method: 'get',
      url: '/api/personal-page/current',
    })
    if(res.err) {
      return null
    }
    return res
  }



  static async updatePersonalPage(id: number, data: Partial<IPersonalPageBlock[]>): Promise<IPersonalPage> {
    const res = await request({
      method: 'patch',
      url: `/api/personal-page/${id}`,
      data : {
        blocks: data
      }
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getPersonalPageById(id: number): Promise<IPersonalPage> {
    const res = await request({
      method: 'get',
      url: `/api/personal-page?s={"profileId": ${id}}`,
    })
    if(res.err) {
      return null
    }
    return res[0]
  }

  static async createPersonalPage(data: Partial<IPersonalPageBlock[]>): Promise<IPersonalPage> {
    const res = await request({
      method: 'post',
      url: '/api/personal-page',
      data: {
        blocks: data
      }
    })
    if(res.err) {
      return null
    }
    return res
  }
}
