import { IArticle } from 'data/interfaces/IArticle'
import { ProfileType } from 'data/interfaces/IRegistration'
import { LOAD_LIMIT } from 'types/constants'
import { Languages } from 'types/enums'
import request from 'utils/request'

export default class ArticlesRepository {
  static async getSavedByCurrentUser(profileType: ProfileType, page: number, limit: number|string = LOAD_LIMIT,): Promise<{data: IArticle[], total: number}|null> {
    const res = await request({
      method: 'get',
      url: `/api/article?savedByCurrentProfile=true&limit=${limit}&page=${page}`,
      profile: profileType
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getById(articleId: number, lang: Languages): Promise<IArticle|null> {
    const res = await request({
      method: 'get',
      url: `/api/article/${articleId}?categoryType=news&language=${lang}`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getCommunityNewsList(profile: ProfileType, communityId: number, page: number): Promise<{data: IArticle[], total: number}|null> {
    const res = await request({
      method: 'get',
      url: `/api/article?articleType=news&limit=${LOAD_LIMIT}&page=${page}&communities=${communityId}`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }
}
