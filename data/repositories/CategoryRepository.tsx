import { ICategorySearchParams, ISpecializationCategory } from 'data/interfaces/Common'
import { Languages } from 'types/enums'
import request from 'utils/request'

export default class CategoryRepository {
  static async getCategories(): Promise<ISpecializationCategory[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/service-category',
      data: {
        lang: Languages.ru
      }
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getSubcategories(data: Partial<ICategorySearchParams>): Promise<ISpecializationCategory[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/service-category',
      data: {
        ...data,
        subcategoriesOnly: true
      }
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getSubCategoriesByCategoryId(id: number, data?: Partial<ICategorySearchParams>): Promise<ISpecializationCategory[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/service-category',
      data: {
        lang: Languages.ru,
        categoryId: id,
        ...data
      }
    })
    if(res.err) {
      return null
    }
    return res
  }
}
