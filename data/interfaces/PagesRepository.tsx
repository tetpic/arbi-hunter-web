import request, { catchNotFoundError } from 'utils/request'
import { IPage } from 'data/interfaces/IPage'

export default class PagesRepository {
  static async fetchBySlug(key?: string): Promise<IPage | null> {
    if (!key) {
      return null
    }

    try {
      const res = await request<IPage[]>({
        url: '/api/page',
        method: 'get',
        data: {
          s: JSON.stringify({ key }),
        },
      })
      return res[0] || null
    } catch (err) {
      catchNotFoundError(err)
    }

    return null
  }
}
