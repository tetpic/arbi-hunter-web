import { ISpecializationCategory, IPosition, ISource } from 'data/interfaces/Common'
import { ICV, ICVCreate, } from 'data/interfaces/ICV'
import { ProfileType } from 'data/interfaces/IRegistration'
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
      //TODO: язык должен добавляться динамически
      url: '/api/service-category?lang=ru',
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getCategoryById(id: number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/service-categorylang=ru&categoryId=${id}`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getSubCategories(data: number): Promise<ISpecializationCategory[]|null> {
    const res = await request({
      method: 'get',
      url: `/api/service-category?lang=ru&categoryId=${data}`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getSavedByCurrentUser(profileType?: ProfileType): Promise<ICV[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/cv?savedByCurrentProfile=true',
      profile: profileType
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async removeCvFromSaved(id: number, profile: ProfileType): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/cv/${id}/removeFromSaved`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async addCvToSaved(id: number, profile: ProfileType): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/cv/${id}/save`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }
}



