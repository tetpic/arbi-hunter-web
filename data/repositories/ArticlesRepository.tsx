import { IArticle } from 'data/interfaces/IArticle'
import { ProfileType } from 'data/interfaces/IRegistration'
import request from 'utils/request'

export default class ArticlesRepository {
  static async getSavedByCurrentUser(profileType: ProfileType, page: number, limit: number|string = process.env.NEXT_PUBLIC_LOAD_LIMIT,): Promise<{data: IArticle[], total: number}|null> {
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
}
