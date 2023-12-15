import { AxiosRequestConfig } from 'axios'
import { ICategory, ICreateNews } from 'data/interfaces/Common'
import { IArticle } from 'data/interfaces/IArticle'
import { ProfileType } from 'data/interfaces/IRegistration'
import { LOAD_LIMIT } from 'types/constants'
import { CategoryType, Languages } from 'types/enums'
import { IPagination } from 'types/types'
import request from 'utils/request'

export default class ArticlesRepository {

  static async getSavedByCurrentUser(data?: {page?: number, limit?: number|string, full?: boolean}): Promise<IPagination<IArticle>|null> {
    const res = await request({
      method: 'get',
      url: '/api/article',
      data: {
        ...data,
        savedByCurrentProfile: true,
        limit: LOAD_LIMIT
      },
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getSubscriptions(page?: number): Promise<IPagination<IArticle>|null> {
    const res = await request({
      method: 'get',
      url: '/api/article',
      data: {
        sort: 'createdAt,DESC',
        subscriptions: true,
        full: true,
        page,
        limit: 10
      }
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getById(articleId: number, lang: Languages): Promise<IArticle|null> {
    
    const res = await request({
      method: 'get',
      url: `/api/article/${articleId}?categoryType=news&full=true&language=${lang}`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getNews(full: boolean, data?: {categories?: [number], forLastNumberOfDays?: number, search?: string, isTop?: boolean, limit?: number, page?: number}): Promise<IPagination<IArticle>|null> {
    const dataToSend: any = {
      isTop: true,
      articleType: 'news',
      full, 
      ...data
    }
    data?.categories&&(dataToSend.categories = data.categories?.join(','))
    
    const res = await request({
      method: 'get',
      url: '/api/article',
      data: dataToSend,
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
        limit: data.limit||LOAD_LIMIT,
        page: data.page||1,
        ...data, 
      }
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getCommunityNewsList(communityId: number, page: number): Promise<IPagination<IArticle>|null> {
    const res = await request({
      method: 'get',
      url: '/api/article',
      data: {
        sort: 'createdAt,DESC',
        articleType: CategoryType.News,
        limit: LOAD_LIMIT,
        page,
        communities: communityId
      }
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async addLikeToArticle(articleId: number, config?: AxiosRequestConfig): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/article/${articleId}/like`,
      config
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async removeLikeFromArticle(articleId: number, config?: AxiosRequestConfig): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/article/${articleId}/unlike`,
      config
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async addArticleToSaved(id: number, config?: AxiosRequestConfig): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/article/${id}/save`,
      config
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async removeArticleFromSaved(id: number, config?: AxiosRequestConfig): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/article/${id}/removeFromSaved`,
      config
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async createNews(data: ICreateNews): Promise<IArticle|null> {
    const res = await request({
      method: 'post',
      url: '/api/article-community',
      data, 
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async editCommunityNews(data: ICreateNews, articleId: number): Promise<IArticle|null> {
    const res = await request({
      method: 'patch',
      url: `/api/article-community/${articleId}`,
      data,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getStories(data = {sort: 'publishedAt,DESC', isTop: false}): Promise<IPagination<IArticle>|null> {
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
