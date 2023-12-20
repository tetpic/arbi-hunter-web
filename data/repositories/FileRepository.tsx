import request from 'utils/request'
import {AxiosRequestConfig} from 'axios'
import { IFile } from 'data/interfaces/Common'

export default class FileRepository {
  static async uploadFile(file: File, config?: AxiosRequestConfig): Promise<IFile> {
    return request({
      url: '/api/asset/upload',
      file: file,
      method: 'put',
      config
    })
  }
  static async deleteMyFile(id: number | string): Promise<{id: string}> {
    return request({
      url: `/api/asset/${id}`,
      method: 'delete',
    })
  }
}
