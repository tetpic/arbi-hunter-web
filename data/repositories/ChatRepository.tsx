import { IChat } from 'data/interfaces/Common'
import { MessageFilterOptions } from 'data/interfaces/IMessage'
import { ProfileType } from 'data/interfaces/IRegistration'
import { IPagination } from 'types/types'
import request from 'utils/request'

export default class ChatRepository {
  static async getChatList(option: MessageFilterOptions, profile: ProfileType, token?: string): Promise<IPagination<IChat>|null> {
    const res = await request({
      method: 'get',
      url: '/api/chat/dialog?sort=lastMessageAt,DESC' + 
      (option.page? `&chatFolderId=${option!.folderId!}`:'') +
      (option.page  ? `&page=${option!.page!}` : '') +
      (option.limit  ? `&limit=${option!.limit!}` : '') +
      (option.vacanciesId  && option.vacanciesId
          ? `&vacanciesIds=${option.vacanciesId.join(',')}`
          : '') +
      (option.search ? `&search=${option.search}` : '') +
      (option.type  ? `&applicationStatus=${option!.type!.convertToString()}` : '') +
      (option.onlyUnread  ? `&onlyUnread=${option!.onlyUnread}` : '') +
      (option.inactive  ? `&inactive=${option!.inactive}` : ''),

      profile,
      token

    })
    if(res.err) {
      return null
    }
    return res
  }
  
}
