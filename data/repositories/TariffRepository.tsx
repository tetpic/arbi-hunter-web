import { IPurchase, ITariff } from 'data/interfaces/Common'
import { PurchaseType } from 'types/enums'
import { IPagination } from 'types/types'
import request from 'utils/request'

export default class TariffRepository {
  static async getTariff(type: PurchaseType): Promise<ITariff[]|null> {
    const res = await request({
      method: 'get',
      url: '/api/tariff',
      data: {
        purchaseType: type
      }
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getPurchasedItems(data: {page: number, limit: number, state?: 'active'}): Promise<IPagination<IPurchase>|null> {
    const res = await request({
      method: 'get',
      url: '/api/purchase',
      data
    })
    if(res.err) {
      return null
    }
    return res
  }


}
