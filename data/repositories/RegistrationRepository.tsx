import request from 'utils/request'
import {AxiosRequestConfig} from 'axios'
import { ICodeResponse, IRegistrationComplete, IRegistrationData, IToken } from 'data/interfaces/IRegistration'



export default class RegistrationRepository {
  static async completeRegistration(data: IRegistrationComplete, config?: AxiosRequestConfig): Promise<IToken> {
    const res = await request<IToken>({
      method: 'post',
      url: '/api/auth/completeRegistration',
      data,
      config
    })
    return res
  }

  static async sendSmsCode(data: IRegistrationData, config?: AxiosRequestConfig): Promise<ICodeResponse> {
    const res = await request<any>({
      method: 'post',
      url: '/api/auth/sendSMSCode',
      data,
      config

    })
    return res
  }

  static async sendEmailCode(data: IRegistrationData, config?: AxiosRequestConfig): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/auth/sendEmailCode',
      data,
      config
    })
    if(res.err) {
      return null
    }
    return res
  }

  static async phoneConfirmation(data: IRegistrationData): Promise<IToken>{
    const res = await request<any>({
      method: 'post',
      url: '/api/auth/phoneConfirmation',
      data
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

  static async emailConfirmation(data: IRegistrationData): Promise<any|null> {
    const res = await request({
      method: 'post',
      url: '/api/auth/emailConfirmation',
      data
    })
    if(res.err) {
      return null
    }
    return res
  }
}

