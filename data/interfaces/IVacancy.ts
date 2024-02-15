import { TariffType, WorkExperience } from 'types/enums'
import { ISource } from './Common'
import { IApplication } from './IApplication'
import { ICV,} from './ICV'
import { IJob} from './IJob'
import { IUserProfile } from './IUser'



export interface IVacancyCreate extends IJob {
  name : string,
  description : string,
  contactName : string,
  company? : string|null, 
  isRemote: boolean,
  published?: boolean
  commission?: number|null
  experience?: WorkExperience
  salaryMin?: number
  salaryMax?: number
  showContactName?: boolean
  showEmail?: boolean
  showPhone?: boolean
  showTelegramNickname?: boolean
  completedSteps?: number[]
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
  applicationsByCurrentUser: IApplication[]
  tariff: TariffType
  topPurchasedAt: string|null
  publishedAt: string|null
}


