import { WorkExperience } from 'types/enums'
import { ISource } from './Common'
import { ICV,} from './ICV'
import { IJob } from './IJob'
import { IUserProfile } from './IUser'

export interface IVacancyCreate extends IJob {
    name : string,
    description : string,
    experience : WorkExperience,
    contactName : string,
    company? : string|null, 
    isRemote: boolean,
    published?: boolean
}

export interface IVacancy extends IVacancyCreate, IUserProfile, ICV {
    contactName: string,
    schedulePublishAt: null,
    isRemote: true,
    published: boolean,
    totalApplications: '0',
    skills: ISource[],
}
