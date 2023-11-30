import { ActivityStatus, HirerRole, HirerRolePermission, Languages, VacancyLookType } from 'types/enums'
import { IImage, TimeStamp } from './Common'
import { IGeoName } from './ILocation'
import { ProfileType } from './IRegistration'

export interface IStats {
  viewsCount: {
    views_count_interval: string,
    views_count_prev_interval: string,
    views_count_prev: string,
    views_count_total: string
  },
  responsesCount: {
      responses_count_interval: string,
      responses_count_prev_interval: string,
      responses_count_total: string
  },
  newVacanciesCount: {
    new_vacancies_count_interval: string,
    new_vacancies_count_prev_interval: string,
    new_vacancies_count_total: string
  },
  newCVsCount: {
    new_cvs_count_interval: string,
    new_cvs_count_prev_interval: string,
    new_cvs_count_total: string
  }
}



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
  countryCode: Languages
  role?: 'admin'|'participant'
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

