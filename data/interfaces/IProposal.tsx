import { ApplicationStatus, ProposalRequestType } from 'types/enums'
import { IApplication } from './IApplication'
import IChat from './IChat'
import { TimeStamp } from './Common'
import { INotification } from './INotification'
import { IUserProfile } from './IUser'
import { IVacancy } from './IVacancy'
import { ICV } from './ICV'

export interface IProposal extends TimeStamp {
  applicationId?: number,
  application?: IApplication
  chat?: IChat[],
  coverLetter? : string,
  cvId?: number,
  cv?: ICV,
  cvDeletedOrHidden?: boolean
  deletedByEmployee?: boolean
  id?: number
  notification?: INotification,
  profile?: IUserProfile|null
  profileId?: number
  status?: ApplicationStatus
  type?: ProposalRequestType,
  vacancy?: IVacancy
  vacancyDeletedOrHidden?: boolean
  vacancyId?: number,
}

export interface IStat {
  status: ApplicationStatus,
  count: number
}
