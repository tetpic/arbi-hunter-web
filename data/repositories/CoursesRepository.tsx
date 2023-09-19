import { ICourseCategory } from 'data/interfaces/Common'
import ICourse, { CoursesData } from 'data/interfaces/ICourse'
import { ProfileType } from 'data/interfaces/IRegistration'
import { CategoryType, Languages } from 'types/enums'
import request from 'utils/request'

export default class CoursesRepository {

  static async getCoursesCategoryList(profile: ProfileType): Promise<{data: ICourseCategory[], total: number}|null> {
    const res = await request({
      method: 'get',
      url: '/api/article-category?categoryType=course',
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getAllCategoryList(profile: ProfileType): Promise<{data: ICourseCategory[], total: number}|null> {
    const res = await request({
      method: 'get',
      url: `/api/article-category?s=${JSON.stringify({'categoryType': 'course'})}`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getCategoryById(id: number, lang: Languages, type: CategoryType): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `'/api/article-category/${id}?lang=${lang}&categoryType=${type}'`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getCourseById(id: number): Promise<ICourse|null> {
    const res = await request({
      method: 'get',
      url: `/api/course/${id}`,
    })
    if(res.err) {
      return null
    }
    return res
  }  

  static async getCourses(data: CoursesData, lang: Languages): Promise<{data: ICourse[], total: number}|null> {
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


  static async getFeedbacks(courseId: number, profile: ProfileType, page: number, limit: number ): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/feedback?s={"courseId": ${courseId}}&sort=createdAt,DESC&page=${page}&limit=${limit}`,
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

  static async getSteps(profile: ProfileType, lang: Languages, blockId: number): Promise<any|null> {
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

  static async getCourseBlock(profile: ProfileType, lang: Languages, courseId: number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/course-block?sort=order,ASC&s={"courseId":${courseId}}&lang=${lang}`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getCourseModule(profile: ProfileType, lang: Languages, courseId: number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/course-module?sort=order,ASC&s={"courseId":${courseId}}&lang=${lang}`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async setStepAnswer(profile: ProfileType, courseBlockStepId: number, answers: number[] ): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/course-block-step-answer',
      data: {
        courseBlockStepId,
        answers
      },
      profile

    })
    if(res.err) {
      return null
    }
    return res
  }
}
