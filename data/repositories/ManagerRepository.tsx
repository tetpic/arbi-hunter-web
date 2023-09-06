import { IManager, IManagerCreate } from 'data/interfaces/IManager'
import { ProfileType } from 'data/interfaces/IRegistration'
import request from 'utils/request'

export default class ManagerRepository {
  static async createNewManager(data: IManagerCreate, profileType: ProfileType): Promise<IManager|null> {
    const res = await request({
      method: 'post',
      url: `/api/manager`,
      data,
      profile: profileType
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getManagersList(page: number, limit: number|string = process.env.NEXT_PUBLIC_LOAD_LIMIT): Promise<IManager[]|null> {
    const res = await request({
      method: 'get',
      url: `/api/manager?page=${page}&limit=${limit}`,
    })
    if(res.err) {
      return null
    }
    return res.data
  }

  static async editManagerById(data: IManagerCreate, id: number, profileType: ProfileType): Promise<any|null> {
    const res = await request({
      method: 'put',
      url: `/api/manager/${id}`,
      data, 
      profile: profileType
    })
    if(res.err) {
      return null
    }
    return res
  }
}
