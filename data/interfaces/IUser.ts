import { ActivityStatus, HirerRole, HirerRolePermission, InterfaceLanguage, Languages, VacancyLookType } from 'types/enums'
import { IFile, TimeStamp } from './Common'
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
  addSavedToDefaultFolder: boolean
  id: number,
  userId: number,
  bio: string
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
  isContactsOpen?: boolean
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
  image: IFile|null,
  country: IGeoName,
  city: IGeoName,
  activityStatus: ActivityStatus,
  countryCode: Languages
  role?: 'admin'|'participant'
  logo?: IFile,
  logoId?: number
  useOwnLogo?: boolean
}

export interface IUser extends TimeStamp {
  name: string
  id: number,
  phone: string,
  language: InterfaceLanguage,
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
  firstName?: string|null,
  lastName?: string|null,
}



