import { IProposal } from 'data/interfaces/IProposal'
import { ApplicationStatus } from 'types/enums'
import request from 'utils/request'

export default class ProposalRepository {
  static async createProposal(data: IProposal): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/proposal',
      data,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getProposalByProfileType(data?: {s: {cvId?: number, vacancyId?: number}}): Promise<IProposal[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/proposal',
      data: {
        s: JSON.stringify(data.s)
      }
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async changeProposalStatusByEmployee(proposalId: number, data: {status: ApplicationStatus, deletedByEmployee?: boolean}): Promise<any|null> {
    const res = await request({
      method: 'patch',
      url: `/api/proposal/${proposalId}`,
      data
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async deleteProposal(proposalId: number): Promise<any|null> {
    const res = await request({
      method: 'delete',
      url: `/api/proposal/${proposalId}`,
    })
    if(res.err) {
      return null
    }
    return res
  }
}
