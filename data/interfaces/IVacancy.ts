import { CompensationType, Currency, EmploymentType, ScheduleType, WorkExperience } from 'types/enums'
import { ISource } from './Common'
import { IApplication } from './IApplication'
import { ICV,} from './ICV'
import { IJob, ILanguageKnowledge } from './IJob'
import { IUserProfile } from './IUser'

export interface IVacancyCreate extends IJob {
  name : string,
  description : string,
  experience : WorkExperience,
  contactName : string,
  company? : string|null, 
  isRemote: boolean,
  published?: boolean
  commission?: number|null
}

export interface IVacancy extends IVacancyCreate, IUserProfile, ICV {
  contactName: string,
  schedulePublishAt: null,
  isRemote: boolean,
  published: boolean,
  totalApplications: string,
  skills: ISource[],
  sources: ISource[]
  applicationByCurrentUser: IApplication
}

export interface IVacancySearchParams {
  search?: string,
  categories?: string|number[] // "1,2,3"
  cities?: string|number[] // '1,2,3'
  employment?: EmploymentType[],
  schedule?: ScheduleType[],
  experience?: WorkExperience,
  currency?: Currency,
  salaryMin?: number,
  commissionMin?: number,
  commissionMax?: number,
  gybridCommissionMin?: number,
  gybridCommissionMax?: number,
  salaryMax?: number,
  skills?: string|number[] // '1,2,3'
  isRemote?: boolean,
  savedByCurrentProfile?: boolean,
  ids?: string|number[], // '1,2,3' по списку идентификаторов
  countries?: string|number[],
  sort?: 'createdAt,DESC',
  compensation?: CompensationType,
  languageKnowledges?: string|ILanguageKnowledge[],
  withCharacter?: boolean
}
