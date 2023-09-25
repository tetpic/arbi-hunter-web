import { ProfileType } from 'data/interfaces/IRegistration'
import request from 'utils/request'

export default class CommunitiesRepository {
  static async getCommunities(profile: ProfileType,limit: number, page: number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/community?$limit=${limit}&page=${page}`,
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
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getCommunityById(profile: ProfileType,  communityId: number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/community/${communityId}`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getCommunityMembers(profile: ProfileType, communityId: number,  page: number, limit: number, search?: string): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/community/${communityId}/subscribers?limit=${limit}&page=${page}` +(search&&`&search=${search}`),
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
