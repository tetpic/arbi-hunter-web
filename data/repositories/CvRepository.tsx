import { ISpecializationCategory, IPosition, ISource } from 'data/interfaces/Common'
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

  static async removeCvFromSaved(id: number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/cv/${id}/removeFromSaved`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async addCvToSaved(id: number, ): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/cv/${id}/save`,
    })
    if(res.err) {
      return null
    }
    return res
  }
}



