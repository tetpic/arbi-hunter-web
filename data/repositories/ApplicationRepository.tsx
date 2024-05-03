import { IApplication } from 'data/interfaces/IApplication'
import { IProposal, IStat } from 'data/interfaces/IProposal'
import { ApplicationStatus, ProposalRequestType } from 'types/enums'
import request from 'utils/request'

export default class ApplicationRepository {
  static async getAllApplications(data?: {cvId?: number, vacancyId?: number}): Promise<IApplication[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/application',
      data: {
        s: JSON.stringify(data)
      }
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getVacancyApplication(vacancyId: number|string): Promise<IApplication[]|null> {
    const dataToSend = vacancyId&&{
      s: JSON.stringify({vacancyId: vacancyId})
    }
    const res = await request({
      method: 'get',
      url: '/api/application',
      data: dataToSend
    })
    if(res.err) {
      return null
    }
    return res
  }

  /* does not work */
  static async getVacanciesByStat(status: ProposalRequestType): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/application?status=${status}`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getStatsCountByVacancy(vacancyId: number|string): Promise<IStat[]|null> {
    const dataToSend = vacancyId&&{
      s: JSON.stringify({vacancyId: vacancyId})
    }

    const res = await request({
      method: 'get',
      url: '/api/application/stats',
      data: dataToSend
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async patchApplicationRespond(applicationId: number, data: {status?: ApplicationStatus, coverLetter?: string, deletedByEmployee?: boolean}): Promise<IProposal|null> {
    const res = await request({
      method: 'patch',
      url: `/api/application/${applicationId}`,
      data
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async sendApplication(data: IApplication): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/application',
      data
      
    })
    if(res.err) {
      return null
    }
    return res
  }


}
