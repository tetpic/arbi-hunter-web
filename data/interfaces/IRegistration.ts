
export enum ProfileType {
  Employee = 'employee',
  Hirer = 'hirer'
}

export interface IRegistrationComplete {
    firstName : string,
    lastName : string,
    password : string,
    phone: string,
    countryId?: number|undefined,
    cityId?: number|undefined,
    profileType : ProfileType,
    telegramNickname : string,
    email: string,
    company?: string|undefined,
}

