import { UpdateCommunityForm } from 'data/interfaces/Common'
import ICommunity from 'data/interfaces/ICommunity'
import { IUserProfile } from 'data/interfaces/IUser'
import { LOAD_LIMIT } from 'types/constants'
import { IPagination } from 'types/types'
import request from 'utils/request'

export default class CommunitiesRepository {
  static async getCommunities(page: number): Promise<IPagination<ICommunity>|null> {
    const res = await request({
      method: 'get',
      url: '/api/community',
      data: {
        limit: 20,
        page
      }
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async createCommunity(data: UpdateCommunityForm): Promise<ICommunity|null> {
    const res = await request({
      method: 'post',
      url: '/api/community',
      data,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async myCommunity(): Promise<IPagination<ICommunity>|null> {
    const res = await request({
      method: 'get',
      url: '/api/community/my',
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getCommunityById(communityId: number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/community/${communityId}`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getCommunityMembers(communityId: number, data: {page?: number,  search?: string, limit?: number}  ): Promise<IPagination<IUserProfile>|null> {
    
    const res = await request({
      method: 'get',
      url: `/api/community/${communityId}/subscribers`,
      data: {
        ...data,
        limit: LOAD_LIMIT
      },
    })
    if(res.err) {
      return null
    }
    return res
  }
  
  static async updateCommunity(communityId: number, data: UpdateCommunityForm): Promise<ICommunity|null> {
    const res = await request({
      method: 'patch',
      url: `/api/community/${communityId}`,
      data,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async subscribeCommunity(communityId: number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/community/${communityId}/subscribe`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async unsubscribeCommunity(communityId: number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/community/${communityId}/unsubscribe`,
    })
    if(res.err) {
      return null
    }
    return res
  }

}
