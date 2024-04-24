import { ICV } from 'data/interfaces/ICV'
import { IFolder } from 'data/interfaces/IFolder'
import { IPagination } from 'types/types'
import request from 'utils/request'



export default class FavoritesFolderRepository {

  static async getFolderList(): Promise<IPagination<IFolder>> {
    const res = await request({
      method: 'get',
      url: '/api/favourite-folder',
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getDefaultFolder(): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: '/api/favourite-folder/default',
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async createNewFolder(): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/favourite-folder',
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async updateFolder(folderId: number): Promise<any|null> {
    const res = await request({
      method: 'patch',
      url: `/api/favourite-folder/${folderId}`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async addCvToFolder(cvId: number, folderId: number): Promise<any|null> {
    const res = await request({
      method: 'get',
      url: `/api/cv/${cvId}/save?favouriteFolderId=${folderId}`,
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async getCvsInFolder(folderId: number, page: number, limit: number): Promise<IPagination<ICV>|null> {
    const res = await request({
      method: 'get',
      url: '/api/cv',
      data: {
        favouriteFolderId: folderId,
        savedByCurrentProfile: true,
        page,
        limit
      }
    })
    if(res.err) {
      return null
    }
    return res
  }

}
