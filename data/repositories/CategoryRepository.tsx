import { ICategorySearchParams, ISpecializationCategory } from 'data/interfaces/Common'
import { InterfaceLanguage, Languages } from 'types/enums'
import request from 'utils/request'

export default class CategoryRepository {
  static async getCategories( lang?: InterfaceLanguage): Promise<ISpecializationCategory[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/service-category',
      data: {
        lang: lang|| Languages.ru
      }
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getSubcategories(data?: Partial<ICategorySearchParams>, lang?: InterfaceLanguage): Promise<ISpecializationCategory[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/service-category',
      data: {
        ...data,
        subcategoriesOnly: true,
        lang
      }
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getSubCategoriesByCategoryId(id: number, data?: Partial<ICategorySearchParams>, lang?: InterfaceLanguage): Promise<ISpecializationCategory[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/service-category',
      data: {
        lang: lang|| Languages.ru,
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
