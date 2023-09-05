import { IArticle } from 'data/interfaces/IArticle'
import { ProfileType } from 'data/interfaces/IRegistration'
import request from 'utils/request'

export default class ArticlesRepository {
  static async getSavedByCurrentUser(profileType: ProfileType): Promise<IArticle[]|null> {
    const res = await request({
      method: 'get',
      url: `/api/article?savedByCurrentProfile=true`,
      profile: profileType
    })
    if(res.err) {
      return null
    }
    return res.data
  }
}
