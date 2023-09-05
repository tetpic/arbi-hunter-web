import { IManager, IManagerCreate } from 'data/interfaces/IManager'
import request from 'utils/request'

export default class ManagerRepository {
  static async createNewManager(data: IManagerCreate): Promise<IManager|null> {
    const res = await request({
      method: 'post',
      url: `/api/manager`,
      data
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getManagersList(page: number, limit: number): Promise<IManager[]|null> {
    const res = await request({
      method: 'get',
      url: `/api/manager?page=${page}&limit=${limit}`,
    })
    if(res.err) {
      return null
    }
    return res.data
  }

  static async editManagerById(data: IManagerCreate, id: string): Promise<any|null> {
    const res = await request({
      method: 'put',
      url: `/api/manager/${id}`,
      data
    })
    if(res.err) {
      return null
    }
    return res
  }

}
