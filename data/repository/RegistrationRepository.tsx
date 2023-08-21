import request from 'utils/request'
import {AxiosRequestConfig} from 'axios'
import { IRegistrationComplete, IRegistrationPhone } from 'data/interfaces/IRegistration'

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

  static async sendSmsCode(data: IRegistrationPhone): Promise<any> {
    debugger
    const res = await request<any>({
      method: 'post',
      url: '/api/auth/sendSMSCode',
      data: data,
    })
    return res
  }

  static async phoneConfirmation(data: IRegistrationPhone): Promise<any>{
    debugger
    const res=  await request<any>({
      method: 'post',
      url: '/api/auth/phoneConfirmation',
      data: data,
    })
    return res
  }
}

