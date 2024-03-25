import request from 'utils/request'



export default class PurchaseRepository {

  static async cvVcPurchase(data: {cvId?: number, vacancyId?: number, tariffId: number, date?: string}): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/subscription',
      data
    })
    if(res.err) {
      return null
    }
    return res
  }
}