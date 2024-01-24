import { WorkExperience } from 'types/enums'
import { ISource } from './Common'
import { IApplication } from './IApplication'
import { ICV,} from './ICV'
import { IJob} from './IJob'
import { IUserProfile } from './IUser'

export enum ContactType {
  Phone = 'phone',
  Email = 'email',
  Telegram = 'telegram',
  Name = 'name'
}

export interface IVacancyCreate extends IJob {
  name : string,
  description : string,
  contactName : string,
  company? : string|null, 
  isRemote: boolean,
  published?: boolean
  commission?: number|null
  experience?: WorkExperience
  contacts?: {
    phone?: string,
    email?: string,
    telegramNickname?: string,
    name?: string
  },
  contactsToShow?: ContactType[]
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


