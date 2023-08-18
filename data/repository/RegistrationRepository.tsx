import request from 'utils/request'
import {AxiosRequestConfig} from 'axios'
import { IRegistrationComplete } from 'data/interfaces/IRegistration'

export default class RegistrationRepository {
  static async completeRegistration(data: IRegistrationComplete, config?: AxiosRequestConfig): Promise<any[]> {
    debugger
    const res = await request<any[]>({
      method: 'post',
      url: '/api/auth/completeRegistration',
      data: data,
      config
    })
    return res
  }
}

