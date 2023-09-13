import { IProposal } from 'data/interfaces/IProposal'
import { ProfileType } from 'data/interfaces/IRegistration'
import request from 'utils/request'

export default class ProposalRepository {
  static async createProposal(data: IProposal, profile: ProfileType): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/proposal',
      data,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

}
