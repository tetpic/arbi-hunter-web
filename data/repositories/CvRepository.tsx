import { AxiosRequestConfig } from 'axios'
import { ISpecializationCategory, IPosition, ISource, IVacancyCvSearchParams } from 'data/interfaces/Common'
import { ICV, ICVCreate, } from 'data/interfaces/ICV'
import { ProfileType } from 'data/interfaces/IRegistration'
import { Languages } from 'types/enums'
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

  static async getGeos(): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: '/api/geo',
    })
    if(res.err) {
      return null
    }
    return res
  }


  /*
  передаю токен и профайл для удобного редактирования резюме - 
  поля сразу заполнены, пользователь не видит пустых полей, если вакансия еще не загрузилась
  */
  static async getById(data: number, profile?: ProfileType, token?: string): Promise<ICV|null> {
    const res = await request({
      method: 'get',
      url: `/api/cv/${data}`,
      profile,
      token
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async updateCV(id: number, data: ICVCreate): Promise<any|null> {
    
    const res = await request({
      method: 'patch',
      url: `/api/cv/${id}`,
      data
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async deleteCV(id: number): Promise<any|null> {
    const res = await request({
      method: 'delete',
      url: `/api/cv/${id}`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getCVListOfCurrentUser(): Promise<ICV[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/cv/currentUser',
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async sourcesList(): Promise<{data: ISource[]}|null> {
    const res = await request({
      method: 'get',
      url: '/api/source',
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getCategories(): Promise<ISpecializationCategory[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/service-category',
      data: {
        lang: Languages.ru
      }
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getSubCategories(id: number): Promise<ISpecializationCategory[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/service-category',
      data: {
        lang: Languages.ru,
        categoryId: id
      }
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getSavedByCurrentUser(): Promise<ICV[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/cv',
      data: {
        savedByCurrentProfile:true
      }
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async removeCvFromSaved(id: number, config?: AxiosRequestConfig): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/cv/${id}/removeFromSaved`,
      config
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async addCvToSaved(id: number, config?: AxiosRequestConfig): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/cv/${id}/save`,
      config
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async findCvs(data: IVacancyCvSearchParams): Promise<ICV[]|null> {
    const dataToSend:any = {...data}
    data?.employment&&data.employment.length>0&&(dataToSend.employment = data.employment.join(','))
    data?.categories&&data.categories.length>0&&(dataToSend.categories = data.categories.join(','))
    data?.categories&&data.categories.length>0&&(dataToSend.categories = data.categories.join(','))
    data?.experience&&data.experience.length>0&&(dataToSend.experience = data.experience.join(','))
    data?.cities&&data.cities.length>0&&(dataToSend.cities = data.cities.join(','))
    data?.schedule&&data.schedule.length>0&&(dataToSend.schedule = data.schedule.join(','))
    data?.languageKnowledges&&data.languageKnowledges.length > 0&&(dataToSend.languageKnowledges = JSON.stringify(data.languageKnowledges.map(el=> {return {language: el.language, levels: [el.level]}} )))
    const res = await request({
      method: 'get',
      url: '/api/cv',
      data: dataToSend
    })
    if(res.err) {
      return null
    }
    return res
  }
}



