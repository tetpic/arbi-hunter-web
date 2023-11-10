import { IApplication } from 'data/interfaces/IApplication'
import { IProposal, IStat } from 'data/interfaces/IProposal'
import { ProfileType } from 'data/interfaces/IRegistration'
import { ProposalRequestType } from 'types/enums'
import request from 'utils/request'

export default class ApplicationRepository {
  static async getAllApplications(profile: ProfileType): Promise<IProposal[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/application',
      profile
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

  /* does not work */
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

  static async getStatsCountByVacancy(vacancyId: number|string, profile: ProfileType): Promise<IStat[]|null> {
    const res = await request({
      method: 'get',
      url: `/api/application/stats?s=${JSON.stringify({vacancyId: vacancyId})}`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async patchApplicationRespond(profile: ProfileType, applicationId: number, data: {status?: ProposalRequestType, coverLetter?: string}): Promise<any|null> {
    const res = await request({
      method: 'patch',
      url: `/api/application/${applicationId}`,
      profile,
      data
    })
    if(res.err) {
      return null
    }
    return res
  }


}
