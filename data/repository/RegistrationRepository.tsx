import request from 'utils/request'
import {AxiosRequestConfig} from 'axios'
import { ICodeResponse, IRegistrationComplete, IRegistrationPhone, IToken } from 'data/interfaces/IRegistration'



export default class RegistrationRepository {
  static async completeRegistration(data: IRegistrationComplete, config?: AxiosRequestConfig): Promise<IToken> {
    
    const res = await request<IToken>({
      method: 'post',
      url: '/api/auth/completeRegistration',
      data: data,
      config
    })
    return res
  }

  static async sendSmsCode(data: IRegistrationPhone): Promise<ICodeResponse> {
    
    const res = await request<any>({
      method: 'post',
      url: '/api/auth/sendSMSCode',
      data: data,
    })
    return res
  }

  static async phoneConfirmation(data: IRegistrationPhone): Promise<IToken>{
    
    const res = await request<any>({
      method: 'post',
      url: '/api/auth/phoneConfirmation',
      data: data,
    })
    return res
  }

  static async login(data: any): Promise<any> {
    
    const res = await request<any>({
      method: 'post',
      url: '/api/auth/login',
      data
    })
    return res
  }
}

