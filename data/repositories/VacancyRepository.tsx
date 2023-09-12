import { ProfileType } from 'data/interfaces/IRegistration'
import { IVacancy, IVacancyCreate } from 'data/interfaces/IVacancy'
import request from 'utils/request'

export default class VacancyRepository {
  static async createVacancy(data: IVacancyCreate): Promise<any | null> {
    const res = await request({
      method: 'post',
      url: '/api/vacancy',
      data
    })
    if (res.err) {
      return null
    }
    return res.data
  }
  
  static async getArchiveVacancies(): Promise<IVacancy[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/vacancy/currentUser?s={"published": false}',
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getActiveVacancies(): Promise<IVacancy[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/vacancy/currentUser?s={"published": true}',
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async editVacancyById(data: Partial<IVacancy>, id: number): Promise<any|null> {
    const res = await request({
      method: 'patch',
      url: `/api/vacancy/${id}`,
      data
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getSavedFromCurrentProfile(profile: ProfileType): Promise<IVacancy[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/vacancy?savedByCurrentProfile=true',
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async addVcToSaved(id: any, profile: ProfileType): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/vacancy/${id}/save`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async removeVcFromSaved(id:number, profile: ProfileType): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/vacancy/${id}/removeFromSaved`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }
}
