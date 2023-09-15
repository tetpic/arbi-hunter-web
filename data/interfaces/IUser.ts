import { ActivityStatus, HirerRole, HirerRolePermission, Languages, VacancyLookType } from 'types/enums'
import { IImage, TimeStamp } from './Common'
import { IGeoName } from './ILocation'
import { ProfileType } from './IRegistration'

export interface IUserProfile extends TimeStamp {
    id: number,
    userId: number,
    profileType: ProfileType,
    hirerRole: HirerRole,
    firstName: string,
    lastName: string,
    patronymic: string|null,
    birthday: string|null,
    telegramNickname: string|null,
    phone: string,
    email: string,
    position: string|null,
    company?: string|null,
    countryId: number,
    cityId: number,
    vacancyLookType: VacancyLookType|null,
    lastActivityAt: string,//Date
    imageId: string|number|null,
    statsIntervalInDays: number,
    statsShowViews: boolean,
    statsShowResponses: boolean,
    statsShowNewVacanciesCount: boolean,
    statsShowNewCVsCount: boolean,
    permissions: HirerRolePermission[],
    ownerId: null,
    image: IImage|null,
    country: IGeoName,
    city: IGeoName,
    activityStatus: ActivityStatus,
    countryCode: string
}


export interface IUser extends TimeStamp {
  name: string
  id: number,
  phone: string,
  language: Languages,
  email: string|null,
  regType: string,//'site' - add enums
  socialId: null,
  isRegistrationCompleted: false,
  balance: number,
  blockComment: string|null,
  blocked: boolean,
  blockedAt: string|null,
  blockedUntil: string|null,
  profiles: IUserProfile[]
  company?: string|null,
}

