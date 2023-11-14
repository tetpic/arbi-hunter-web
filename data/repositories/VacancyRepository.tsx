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
      url: '/api/vacancy/currentUser?s={"published": true}&sort=updatedAt,DESC',
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async editVacancyById(data: IVacancyCreate, id: number): Promise<any|null> {
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


  /*
  передаю токен и профайл для удобного редактирования вакансии - 
  поля сразу заполнены, пользователь не видит пустых полей, если вакансия еще не загрузилась
  */
  static async getVacancyById(id: number, profile?: ProfileType, token?: string): Promise<IVacancy|null> {
    const res = await request({
      method: 'get',
      url: `/api/vacancy/${id}`,
      profile,
      token
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getSavedFromCurrentProfile(): Promise<IVacancy[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/vacancy?savedByCurrentProfile=true',
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async addVcToSaved(id: any): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/vacancy/${id}/save`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async removeVcFromSaved(id:number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/vacancy/${id}/removeFromSaved`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async removeVacancy(id: number): Promise<any|null> {
    const res = await request({
      method: 'delete',
      url: `/api/vacancy/${id}`,
    })
    if(res.err) {
      return null
    }
    return res
  }
}
