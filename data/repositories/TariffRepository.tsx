import { ITariff } from 'data/interfaces/Common'
import { PurchaseType } from 'types/enums'
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


}
