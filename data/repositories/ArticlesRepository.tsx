import { ICategory, ICreateNews } from 'data/interfaces/Common'
import { IArticle } from 'data/interfaces/IArticle'
import { ProfileType } from 'data/interfaces/IRegistration'
import { LOAD_LIMIT } from 'types/constants'
import { CategoryType, Languages } from 'types/enums'
import { IPagination } from 'types/types'
import request from 'utils/request'

export default class ArticlesRepository {

  static async getSavedByCurrentUser(profileType: ProfileType, data?: {page?: number, limit?: number|string, full?: boolean}): Promise<IPagination<IArticle>|null> {
    const res = await request({
      method: 'get',
      url: '/api/article',
      data: {
        ...data,
        savedByCurrentProfile: true,
        limit: LOAD_LIMIT
      },
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

  static async getNews(full: boolean, data?: {categories?: number, isTop?: boolean, limit?: number, page?: number}, profile?: ProfileType): Promise<IPagination<IArticle>|null> {
    const res = await request({
      method: 'get',
      url: '/api/article',
      data: {
        isTop: true,
        articleType: 'news',
        full: full,
        ...data,
      },
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async removeArticle(profile: ProfileType, id: number): Promise<any|null> {
    const res = await request({
      method: 'delete',
      url: `/api/article-community/${id}`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getCategoryById(id: number, data?: {lang?: Languages, categoryType?: CategoryType}): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/article-category/${id}`,
      data

    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getCategoryList(data?: {categoryType?: CategoryType, page?: number, limit?: number}): Promise<IPagination<ICategory>|null> {
    const res = await request({
      method: 'get',
      url: '/api/article-category',
      data: {
        limit: LOAD_LIMIT,
        page: 1,
        ...data, 
      }
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getCommunityNewsList(profile: ProfileType, communityId: number, page: number): Promise<IPagination<IArticle>|null> {
    const res = await request({
      method: 'get',
      url: `/api/article?sort=createdAt,DESC&articleType=news&limit=${LOAD_LIMIT}&page=${page}&communities=${communityId}`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async addLikeToArticle(profile: ProfileType, articleId: number ): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/article/${articleId}/like`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async removeLikeFromArticle(profile: ProfileType, articleId: number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/article/${articleId}/unlike`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async addArticleToSaved(profile: ProfileType, id: number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/article/${id}/save`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async createNews(profile: ProfileType, data: ICreateNews): Promise<IArticle|null> {
    const res = await request({
      method: 'post',
      url: '/api/article-community',
      data, 
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async editCommunityNews(profile: ProfileType, data: ICreateNews, articleId: number): Promise<IArticle|null> {
    const res = await request({
      method: 'patch',
      url: `/api/article-community/${articleId}`,
      data,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getStories(data = {sort: 'publishedAt,DESC', /*forLastNumberOfDays: 7, */ isTop: false}): Promise<IPagination<IArticle>|null> {
    const res = await request({
      method: 'get',
      url: '/api/story',
      data
    })
    if(res.err) {
      return null
    }
    return res
  }
}
