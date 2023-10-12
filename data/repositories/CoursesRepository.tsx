import { IArticle } from 'data/interfaces/IArticle'
import ICourse, { CoursesData, ICourseBlock, ICourseFeedback, ICourseStats, ICourseStep, ICourseStepAnswer } from 'data/interfaces/ICourse'
import { ProfileType } from 'data/interfaces/IRegistration'
import { Languages } from 'types/enums'
import { IPagination } from 'types/types'
import request from 'utils/request'

export default class CoursesRepository {

  static async getCourseModules(courseId: number, lang: Languages, token?: string): Promise<ICourseBlock[]|null> {
    const res = await request({
      method: 'get',
      url: `/api/course-module?sort=order,ASC&s={"courseId": ${courseId}}&language=${lang}`,
      token
    })
    if(res.err) {
      return null
    }
    return res.data
  }

  static async getCourseById(id: number, token?: string): Promise<ICourse|null> {
    const res = await request({
      method: 'get',
      url: `/api/course/${id}`,
      token
    })
    if(res.err) {
      return null
    }
    return res
  }  

  static async getCourses(data: CoursesData, lang: Languages): Promise<IPagination<ICourse>|null> {
    const object = {
      page: data.page!= null ? `&page=${data.page}` : null,
      limit: data.limit!= null ? `&limit=${data.limit}` : null,
      categories: data.categories != null ? `&categories=${data.categories.join(',')}` : null,
      isStarted: data.isStarted != null ? '&started=$isStarted' : null,
      search: data.search != null ? '&search=$search' : null,
    }
    const res = await request({
      method: 'get',
      url: `/api/course?sort=createdAt,DESC&languages=${lang},en` + Object.values(object).filter(Boolean).join(''),
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getFeedbacks(courseId: number,  page: number, limit: number, lang?: Languages): Promise<ICourseFeedback[]|null> {
    const res = await request({
      method: 'get',
      url: `/api/feedback?${courseId?`s={"courseId": ${courseId}`:''}&sort=createdAt,DESC&page=${page}&limit=${limit}${lang?'&lang='+lang:''}`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async sendFeedback(profile: ProfileType, courseId: number, mark: number, content: string): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/feedback',
      data: {
        courseId,
        mark,
        content
      },
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getRating(profile: ProfileType, courseId: number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/feedback/stats?s={"courseId": ${courseId}}`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getStepsByBlockId(profile: ProfileType, lang: Languages, blockId: number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/course-block-step?sort=order,ASC&s={"courseBlockId":${blockId}}&lang=${lang}`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getCourseBlock(profile: ProfileType, lang: Languages, courseId: number, token?: string): Promise<IPagination<ICourseBlock>|null> {
    const res = await request({
      method: 'get',
      url: `/api/course-block?sort=order,ASC&s={"courseId":${courseId}}&language=${lang}`,
      profile,
      token
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getCourseSteps(profile: ProfileType, lang: Languages, courseId: number): Promise<IPagination<ICourseStep>|null> {
    const res = await request({
      method: 'get',
      url: `/api/course-block-step/?sort=order,ASC&s={"courseBlockId":${courseId}}&language=${lang}`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async setStepAnswer(profile: ProfileType, data: ICourseStepAnswer ): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/course-block-step-answer',
      data,
      profile

    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getCoursesNews(profile: ProfileType, lang: Languages, courseId: number, limit: number, page: number): Promise<IArticle[]|null> {
    const res = await request({
      method: 'get',
      url: `/api/article?categoryType=news&sort=createdAt,DESC&limit=${limit}&page=${page}&courseId=${courseId}&language=${lang}`,
      profile
    })
    if(res.err) {
      return null
    }
    return res.data
  }

  static async getCourseFeedbackStats(profile: ProfileType, courseId: number): Promise<ICourseStats|null> {
    const res = await request({
      method: 'get',
      url: `/api/feedback/stats?s={"courseId": ${courseId}}`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }
}
