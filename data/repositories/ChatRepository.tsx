import { AxiosRequestConfig } from 'axios'
import IChat, { IChatFolder, IMessage, MessageFilterOptions } from 'data/interfaces/IChat'
import { ProfileType } from 'data/interfaces/IRegistration'
import { IPagination } from 'types/types'
import request from 'utils/request'

export default class ChatRepository {
  static async getChatList(option: MessageFilterOptions, profile: ProfileType, token?: string, config?: AxiosRequestConfig): Promise<IPagination<IChat>|null> {
    const res = await request({
      method: 'get',
      url: '/api/chat/dialog',
      data: {
        ...option,
        sort: 'lastMessageAt,DESC'
      },
      profile,
      token,
      config

    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getContactList(profile: ProfileType, token?: string): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: '/api/chat/contacts',
      profile,
      token
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getChatFolders(profile: ProfileType, token?: string): Promise<IPagination<IChatFolder>|null> {
    const res = await request({
      method: 'get',
      url: '/api/chat-folder?sort=pinned,DESC&sort=lastMessageAt,DESC',
      profile,
      token
    })
    if(res.err) {
      return null
    }
    return res
  }


  static async editChatFolderState(profile: ProfileType, data: {id: number, name?: string, notifications?: boolean, pinned?: boolean}): Promise<any|null> {
    const {id, ...rest} = data
    const res = await request({
      method: 'patch',
      url: `/api/chat-folder/${id}`,
      data: rest, 
      profile,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getChatByContactId(profile: ProfileType, id: number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/chat/dialog/${id}`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async moveChatToFolder(profile: ProfileType, data: {chatFolderId: number, chatsIds: number[]}): Promise<any|null> {
    
    const res = await request({
      method: 'post',
      url: '/api/chat/move',
      data,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async deleteChatFolder(profile: ProfileType, id: number): Promise<any|null> {
    const res = await request({
      method: 'delete',
      url: `/api/chat-folder/${id}`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async createChatFolder(profile: ProfileType, data: {name: string}): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/chat-folder',
      data,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async createMessage(profile: ProfileType, data: IMessage): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/chat/messages',
      data,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getChatByVacancies(profile: ProfileType): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: '/api/chat/vacancies?page=1&limit=100',
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async deleteChat(profile: ProfileType, id: number): Promise<any|null> {
    const res = await request({
      method: 'delete',
      url: `/api/chat/${id}`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getChatById( profile: ProfileType , id: number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/chat/${id}`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async searchByContact(profile: ProfileType, search: string): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/chat/dialog?search=${search}`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async searchByMessage(profile: ProfileType, search: string): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/chat/messages/search?search=${search}`,
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getMessagesByChatId(profile: ProfileType, chatId: number,  lastCreatedAt: string | null = null, limit: number = 30): Promise<IPagination<IMessage>|null> {
    const res = await request({
      method: 'get',
      url: `/api/chat/${chatId}/messages`,
      data: {
        lastCreatedAt,
        limit
      },
      profile
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async setReadIds(profile: ProfileType ,ids: number[]): Promise<IChat | null> {
    return request({
      url: '/api/chat/messages/state',
      method: 'post',
      data: {
        ids,
        read: true
      },
      profile
    })
  }
}
