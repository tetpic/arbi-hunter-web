
export enum ProfileType {
  Employee = 'employee',
  Hirer = 'hirer'
}

export interface IRegistrationComplete {
  firstName : string,
  lastName : string,
  patronymic: string,
  password : string,
  phone?: string,
  countryId?: number|undefined,
  cityId?: number|undefined,
  profileType : ProfileType,
  telegramNickname : string,
  email: string,
  company?: string|undefined,
  agreement?: boolean
}

export interface ILogin {
  login?: string,
  phone?: string,
  email?: string
  password?: string
}

export interface IRegistrationData {
  phone?: string,
  email?: string
  code?: string 
}

export interface ICodeResponse {
  code: string,
  codeCanRetryIn: number,
  codeExpiredAt: string, //type Date
  success: boolean
}

export interface ILoginFormData {
  email?: string,
  phone?: string
}

export interface IToken {
  expiresIn: number,
  accessToken: string
}