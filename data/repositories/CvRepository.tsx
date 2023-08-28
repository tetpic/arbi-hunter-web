import { ICVCreate, IPosition } from 'data/interfaces/ICV'
import request from 'utils/request'

export default class CvRepository {

  static async sugestCVPosition(s: string): Promise<IPosition[] | null> {
    const res = await request(`/api/cv/suggest?search=${s}`)
    if (res.err) {
      return null
    }
    return res
  }

  static async createCV(data: ICVCreate): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/cv',
      data
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getById(data: number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/cv/${data}`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async updateCV(data: number): Promise<any|null> {
    const res = await request({
      method: 'patch',
      url: `/api/cv/${data}`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async deleteCV(data: any): Promise<any|null> {
    const res = await request({
      method: 'delete',
      url: `/api/cv/${data}`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getCVListOfCurrentUser(): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/cv/currentUser`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async sourcesList(): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/source`,
    })
    if(res.err) {
      return null
    }
    return res
  }
}



