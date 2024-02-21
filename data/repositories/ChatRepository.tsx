import { AxiosRequestConfig } from 'axios'
import IChat, { IChatFolder, IMessage, MessageFilterOptions } from 'data/interfaces/IChat'
import { IPagination } from 'types/types'
import request from 'utils/request'

export default class ChatRepository {
  static async getChatList(option: MessageFilterOptions, config?: AxiosRequestConfig): Promise<IPagination<IChat>|null> {
    const res = await request({
      method: 'get',
      url: '/api/chat/dialog',
      data: {
        ...option,
        sort: 'lastMessageAt,DESC'
      },
      config
    })
    if(res.err) {
      
      return null
    }
    return res
  }

  static async getContactList(): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: '/api/chat/contacts',
    })
    if(res.err) {
      
      return null
    }
    return res
  }

  static async getChatFolders(): Promise<IPagination<IChatFolder>|null> {
    const res = await request({
      method: 'get',
      url: '/api/chat-folder?sort=pinned,DESC&sort=lastMessageAt,DESC',
    })
    if(res.err) {
      
      return null
    }
    return res
  }


  static async editChatFolderState(data: {id: number, name?: string, notifications?: boolean, pinned?: boolean}): Promise<any|null> {
    const {id, ...rest} = data
    const res = await request({
      method: 'patch',
      url: `/api/chat-folder/${id}`,
      data: rest, 
    })
    if(res.err) {
      
      return null
    }
    return res
  }

  static async getChatByContactId(id: number, data?: {applicationId?: number, proposalId?: number}): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/chat/dialog/${id}`,
      data
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async moveChatToFolder(data: {chatFolderId: number, chatsIds: number[]}): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/chat/move',
      data,
    })
    if(res.err) {
      
      return null
    }
    return res
  }

  static async deleteChatFolder(id: number): Promise<any|null> {
    const res = await request({
      method: 'delete',
      url: `/api/chat-folder/${id}`,
    })
    if(res.err) {
      
      return null
    }
    return res
  }

  static async createChatFolder(data: {name: string}): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/chat-folder',
      data,
    })
    if(res.err) {
      
      return null
    }
    return res
  }

  static async createMessage(data: IMessage): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/chat/messages',
      data,
    })
    if(res.err) {
      
      return null
    }
    return res
  }

  static async getChatByVacancies(): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: '/api/chat/vacancies?page=1&limit=100',
    })
    if(res.err) {
      
      return null
    }
    return res
  }

  static async deleteChat(id: number): Promise<any|null> {
    const res = await request({
      method: 'delete',
      url: `/api/chat/${id}`,
    })
    if(res.err) {
      
      return null
    }
    return res
  }

  static async getChatById(id: number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/chat/${id}`,
    })
    if(res.err) {
      
      return null
    }
    return res
  }

  static async searchByContact(search: string): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/chat/dialog?search=${search}`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async searchByMessage(search: string): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/chat/messages/search?search=${search}`,
    })
    if(res.err) {
      
      return null
    }
    return res
  }

  static async getMessagesByChatId( chatId: number,  lastCreatedAt: string | null = null, limit: number = 30): Promise<IPagination<IMessage>|null> {
    const res = await request({
      method: 'get',
      url: `/api/chat/${chatId}/messages`,
      data: {
        lastCreatedAt,
        limit
      },
    })
    if(res.err) {
      
      return null
    }
    return res
  }

  static async setReadIds(ids: number[]): Promise<IChat | null> {
    return request({
      url: '/api/chat/messages/state',
      method: 'post',
      data: {
        ids,
        read: true
      },
    })
    .catch(err => {
      
    })
  }
}
