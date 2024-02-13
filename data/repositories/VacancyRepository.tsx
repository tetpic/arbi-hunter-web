import { AxiosRequestConfig } from 'axios'
import { IVacancyCvSearchParams } from 'data/interfaces/Common'
import { ProfileType } from 'data/interfaces/IRegistration'
import { IVacancy, IVacancyCreate} from 'data/interfaces/IVacancy'
import { IPagination } from 'types/types'
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
    return res
  }
  
  static async getArchiveVacancies(): Promise<IVacancy[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/vacancy/currentUser?s={"published": false}&sort=updatedAt,DESC',
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
    if(!id || id === 0) {
      return null
    }
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

  static async addVcToSaved(id: any, config?: AxiosRequestConfig): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/vacancy/${id}/save`,
      config
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async removeVcFromSaved(id:number, config?: AxiosRequestConfig): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/vacancy/${id}/removeFromSaved`,
      config
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

  static async searchVacancies(data: IVacancyCvSearchParams, page?: number, limit: number = 40): Promise<IPagination<IVacancy>|null> {
    const dataToSend:any = {...data, page, limit}
    data?.employment&&data.employment.length>0&&(dataToSend.employment = data.employment.join(','))
    data?.sources&&data.sources.length>0&&(dataToSend.sources = data.sources.join(','))
    data?.categories&&data.categories.length>0&&(dataToSend.categories = data.categories.join(','))
    data?.experience&&data.experience.length>0&&(dataToSend.experience = data.experience.join(','))
    data?.cities&&data.cities.length>0&&(dataToSend.cities = data.cities.join(','))
    data?.schedule&&data.schedule.length>0&&(dataToSend.schedule = data.schedule.join(','))
    data?.languageKnowledges&&data.languageKnowledges.length > 0&&(dataToSend.languageKnowledges = JSON.stringify(data.languageKnowledges.map(el=> {return {language: el.language, levels: [el.level]}} )))
    const res = await request({
      method: 'get',
      url: '/api/vacancy',
      data: dataToSend
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async suggestPosition(data: {search: string}): Promise<{name: string}[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/vacancy/suggest',
      data
    })
    if(res.err) {
      return null
    }
    return res
  }
}
