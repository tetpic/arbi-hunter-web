import { IArticle } from 'data/interfaces/IArticle'
import ICourse, { CoursesData, ICourseBlock, ICourseFeedback, ICourseStats, ICourseStep, ICourseStepAnswer } from 'data/interfaces/ICourse'
import { ProfileType } from 'data/interfaces/IRegistration'
import { Languages } from 'types/enums'
import { IPagination } from 'types/types'
import request from 'utils/request'

export default class CoursesRepository {

  static async getCourseModules(lang: Languages, courseId: number ): Promise<ICourseBlock[]|null> {
    const res = await request({
      method: 'get',
      url: `/api/course-module?sort=order,ASC&s={"courseId": ${courseId}}&language=${lang}`,
    })
    if(res.err) {
      return null
    }
    return res.data
  }


  //передаем токен и профиль при запросе с сервера, для красивого заголовка страницы
  static async getCourseById(id: number, profile?: ProfileType, token?: string): Promise<ICourse|null> {
    const res = await request({
      method: 'get',
      url: `/api/course/${id}`,
      profile,
      token
    })
    if(res.err) {
      return null
    }
    return res
  }  

  static async getCourses(data: CoursesData, lang: Languages): Promise<IPagination<ICourse>|null> {
    // const object = {
    //   page: data.page!= null ? `&page=${data.page}` : null,
    //   limit: data.limit!= null ? `&limit=${data.limit}` : null,
    //   categories: data.categories != null ? `&categories=${data.categories.join(',')}` : null,
    //   isStarted: data.isStarted != null ? '&started=$isStarted' : null,
    //   search: data.search != null ? '&search=$search' : null,
    // }
    const res = await request({
      method: 'get',
      url: '/api/course',
      data: {
        ...data,
        // categories: data.categories.join(','),
        lang
      }
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getFeedbacks(courseId: number,  page: number, limit: number, lang?: Languages): Promise<ICourseFeedback[]|null> {
    const res = await request({
      method: 'get',
      url: `/api/feedback?${courseId?`s={"courseId": ${courseId}}`:''}&sort=createdAt,DESC&page=${page}&limit=${limit}${lang?'&lang='+lang:''}`,
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

  static async getStepsByBlockId(lang: Languages, blockId: number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: '/api/course-block-step',
      data: {
        sort:'order,ASC',
        s: `{"courseBlockId":${blockId}}`,
        lang
      }
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getCourseBlock(lang: Languages, courseId: number): Promise<IPagination<ICourseBlock>|null> {
    const res = await request({
      method: 'get',
      url: `/api/course-block?sort=order,ASC&s={"courseId":${courseId}}&language=${lang}`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getCourseSteps(lang: Languages, courseId: number): Promise<IPagination<ICourseStep>|null> {
    const res = await request({
      method: 'get',
      url: `/api/course-block-step/?sort=order,ASC&s={"courseBlockId":${courseId}}&language=${lang}`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async setStepAnswer(data: ICourseStepAnswer ): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/course-block-step-answer',
      data,

    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getCoursesNews(data: {lang: Languages, courseId: number, limit: number, page: number, full: boolean}): Promise<IArticle[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/article',
      data: {
        categoryType: 'news',
        sort: 'createdAt,DESC',
        ...data
      },
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

  static async sendCourseFeedback(data: {courseId: number, mark: number, content?: string}): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/feedback',
      data
    })
    if(res.err) {
      return null
    }
    return res
  }
}
