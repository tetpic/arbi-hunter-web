import { IManager, IManagerCreate } from 'data/interfaces/IManager'
import { ProfileType } from 'data/interfaces/IRegistration'
import { LOAD_LIMIT } from 'types/constants'
import { IPagination } from 'types/types'
import request from 'utils/request'

export default class ManagerRepository {
  static async createNewManager(data: IManagerCreate, profileType: ProfileType): Promise<IManager|null> {
    const res = await request({
      method: 'post',
      url: '/api/manager',
      data,
      profile: profileType
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getManagersList(page: number, limit: number|string = LOAD_LIMIT): Promise<IPagination<IManager>|null> {
    const res = await request({
      method: 'get',
      url: `/api/manager?page=${page}&limit=${limit}`,
    })
    if(res.err) {
      return null
    }
    return res
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
