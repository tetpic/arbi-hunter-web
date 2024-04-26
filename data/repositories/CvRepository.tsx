import { AxiosRequestConfig } from 'axios'
import { IPosition, IVacancyCvSearchParams } from 'data/interfaces/Common'
import { ICV, ICVCreate, } from 'data/interfaces/ICV'
import { ProfileType } from 'data/interfaces/IRegistration'
import { IPagination } from 'types/types'
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

  static async addCvToSaved(data:{id: number, favouriteFolderId?: number}, config?: AxiosRequestConfig): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/cv/${data.id}/save`,
      data: data.favouriteFolderId ? {favouriteFolderId: data.favouriteFolderId} : {},
      config
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async findCvs(data: IVacancyCvSearchParams, page?: number, limit: number = 40): Promise<IPagination<ICV>|null> {
    const dataToSend:any = {...data, page, limit, sort: 'createdAt,DESC'}
    Object.entries(dataToSend).forEach(([key, value]) => {
      if(Array.isArray(value)) {
        dataToSend[key] = value.join(',')
      }
    })
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

  static async openContacts(id: number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/cv/${id}/openContacts`,
    })
    if(res.err) {
      return null
    }
    return res
  }
}



