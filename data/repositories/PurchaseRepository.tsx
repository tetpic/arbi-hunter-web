import { IPurchase, ITariff, PurchaseForm, RefillBalanceData } from 'data/interfaces/Common'
import { PurchaseType } from 'types/enums'
import { IPagination } from 'types/types'
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

  static async addContactsOpenToTariff(data: {subscriptionId: number, contactsCanOpenCount: number}): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: `/api/subscription/${data.subscriptionId}/addContactsOpen`,
      data: {
        contactsCanOpenCount: data.contactsCanOpenCount
      }
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getPurchasedItems(data: {purchaseType?: string, page: number, limit: number, state?: 'active'}): Promise<IPagination<IPurchase>|null> {
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

  static async getActiveSubscriptions(data: {purchaseType: PurchaseType[]}): Promise<IPagination<IPurchase>|null> {
    const res = await request({
      method: 'get',
      url: '/api/purchase',
      data: {
        state: 'active',
        purchaseType: data.purchaseType.join(',')
      }
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async refillBalance(data: RefillBalanceData): Promise<{payUrl: string}|null> {
    const res = await request({
      method: 'post',
      url: '/api/payment',
      data
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async upgradeSubscription(subscriptionId: number|string, data:Partial<PurchaseForm>): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: `/api/subscription/${subscriptionId}/upgrade`,
      data
    })
    if(res.err) {
      return null
    }
    return res
  }
}