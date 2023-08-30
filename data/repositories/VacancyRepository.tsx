import { IVacancyCreate } from 'data/interfaces/IVacancy'
import request from 'utils/request'

export default class VacancyRepository {
  static async createVacancy(data: IVacancyCreate): Promise<any | null> {
    const res = await request({
      method: 'post',
      url: `/api/vacancy`,
      data
    })
    if (res.err) {
      return null
    }
    return res.data
  }
}
