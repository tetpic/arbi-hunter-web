import ICommunity from 'data/interfaces/ICommunity'
import { ProfileType } from 'data/interfaces/IRegistration'
import { IUserProfile } from 'data/interfaces/IUser'
import { LOAD_LIMIT } from 'types/constants'
import request from 'utils/request'

interface Response <T> {
  total: number,
  data: T,
  count?: number,
  pageCount?: number
}

export default class CommunitiesRepository {
  static async getCommunities(profile: ProfileType, page: number): Promise<Response<ICommunity[]>|null> {
    const res = await request({
      method: 'get',
      url: `/api/community?limit=${20}&page=${page}`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async createCommunity(profile: ProfileType,  data: {name: string, categoryId: number}): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/community',
      profile
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

  static async getCommunityMembers(profile: ProfileType, communityId: number,  page: number,  search?: string): Promise<Response<IUserProfile[]>|null> {
    const res = await request({
      method: 'get',
      url: `/api/community/${communityId}/subscribers?limit=${LOAD_LIMIT}&page=${page}` +(search?`&search=${search}`:''),
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }
  
  static async updateCommunity(profile: ProfileType, communityId: number, data: {name?: string, imageId?: number, logoId?: number}): Promise<any|null> {
    const res = await request({
      method: 'patch',
      url: `/api/community/${communityId}`,
      data,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async subscribeCommunity(profile: ProfileType, communityId: number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/community/${communityId}/subscribe`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async unsubscribeCommunity(profile: ProfileType, communityId: number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/community/${communityId}/unsubscribe`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

}
