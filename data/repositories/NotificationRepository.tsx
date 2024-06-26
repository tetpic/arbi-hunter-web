import { ItemsNotificationType } from 'data/interfaces/INotification'
import request from 'utils/request'

export default class NotificationRepository {
  static async getUnreadStats(): Promise<{items: {type: ItemsNotificationType, count: number}[], total: number}|null> {
    const res = await request({
      method: 'get',
      url: '/api/notification/unread-stat',
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getNotifyList(data: {types?: ItemsNotificationType, lastCreatedAt?: string}, page?: number, limit?: number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: '/api/notification',
      data: {
        page: page||1,
        limit: limit||10,
        ...data
      }
    })
    if(res.err) {
      return null
    }
    return res
  }
}

