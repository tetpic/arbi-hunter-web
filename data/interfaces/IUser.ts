import { ActivityStatus, HirerRole, VacancyLookType } from "types/enums"
import { IGeoName } from "./ILocation"
import { ProfileType } from "./IRegistration"

export interface IUserProfile {
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
    company: string|null,
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
    permissions: [],
    ownerId: null,
    createdAt: string,// Date
    updatedAt: string, // Date
    deletedAt: string|null, // Date
    image: string|null,
    country: IGeoName,
    city: IGeoName,
    activityStatus: ActivityStatus,
    countryCode: string
}


export interface IUser {
  name: string
  id: number,
  phone: string,
  language: string,//'ru' - add enums
  email: string|null,
  regType: string,//'site' - add enums
  socialId: null,
  isRegistrationCompleted: false,
  balance: 0,
  blockComment: null,
  blocked: false,
  blockedAt: null,
  blockedUntil: null,
  createdAt: "2023-08-22T11:40:00.308Z",
  updatedAt: "2023-08-22T11:40:00.308Z",
  deletedAt: null,
  profiles: IUserProfile[]
}

