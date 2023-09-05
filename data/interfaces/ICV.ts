import { EducationTypes, Genders, Languages, ScheduleType, VacancyLookType, WorkExperiencePresense } from "types/enums"
import { CoursesInfo, EducationInfo, ExperienceInfo, ITranslation, TimeStamp } from "./Common"
import { IJob } from "./IJob"
import { IGeoName } from "./ILocation"
import { IUser, IUserProfile } from "./IUser"


export interface ICategory extends TimeStamp {
  id: number, 
  imageId: number|null,
  showOnMain: boolean,
  color: number|null,
  importId: number|null,
  parentId: number|null,
  sort: number,
  image: string|null,
  translations: ITranslation[],
  languageCode: Languages,
  name: string,
  description: string|null,
  baseId: number,
  isMain: boolean
  vacanciesCount?: number|null,
  cvsCount?: number|null,
  newVacanciesCount?: number|null,
  newCvsCount?: number|null,
  minVacanciesSalary?: number|null,
  maxVacanciesSalary?: number|null,
  minCVsSalary?: number|null,
  maxCVsSalary?: number|null,
}

export interface ICVCreate extends IJob {
  vacancyLookType : VacancyLookType,
  firstName : string,
  lastName: string,
  patronymic: string,
  birthday: string, //05.02.2023
  gender? : Genders,
  workExperiencePresense: WorkExperiencePresense, 
  education: EducationTypes, 
  relocation : EducationTypes, 
  position: string,
  bio: string,
  nativeLanguage: Languages, 
  experienceInfo: ExperienceInfo[],
  educationInfo: EducationInfo[],
  coursesInfo: CoursesInfo[],
}


export interface ICV extends ICVCreate, IUserProfile{
  businessTrips?: boolean|null,
  portfolio: string|null,
  profileId: number,
  commission: string|null,
  moderationStatus: string,  // "approved"add enums
  moderationRejectReason: string|null,
  published: boolean,
  totalViews: string|null,
  totalProposals: number|null,
  isTop: boolean,
  topPurchasedAt: string|null,
  hash: string,
  image: string|null,
  categories: ICategory[],
  city: IGeoName,
  profile: IUserProfile,
  savedByProfiles: IUserProfile[],
  proposalByCurrentUser: boolean|null,//???
  isSavedByCurrentProfile: boolean,
  age: number,
  lastExperienceInfo: ExperienceInfo
}