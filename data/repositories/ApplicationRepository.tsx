import { IApplication } from 'data/interfaces/IApplication'
import { ProfileType } from 'data/interfaces/IRegistration'
import { ProposalRequestType } from 'types/enums'
import request from 'utils/request'

export default class ApplicationRepository {
  static async getAllApplications(data: any): Promise<IApplication[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/application',
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getVacancyApplication(vacancyId: number|string, profile: ProfileType): Promise<IApplication[]|null> {
    const res = await request({
      method: 'get',
      url: `/api/application?s=${JSON.stringify({vacancyId: vacancyId})}`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getVacanciesByStat(status: ProposalRequestType, profile: ProfileType): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/application?status=${status}`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }
}
