import { IView } from 'data/interfaces/IView'
import request from 'utils/request'

export default class ViewsRepository {
  static async getCvViews(cvId: any): Promise<{data: IView[]}|null> {
    const res = await request({
      method: 'get',
      url: `/api/cv/${cvId}/views`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getVacancyViews(vacancyId: any): Promise<{data: IView[]}|null> {
    const res = await request({
      method: 'get',
      url: `/api/vacancy/${vacancyId}/views`,
    })
    if(res.err) {
      return null
    }
    return res
  }
}