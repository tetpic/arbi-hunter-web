import { ApplicationStatus, ProposalRequestType } from 'types/enums'
import { IApplication } from './IApplication'
import IChat from './IChat'
import { TimeStamp } from './Common'
import { INotification } from './INotification'
import { IUserProfile } from './IUser'
import { IVacancy } from './IVacancy'

export interface IProposal extends TimeStamp {
  applicationId?: number,
  application?: IApplication
  cvId?: number,
  vacancyId?: number,
  vacancy?: IVacancy
  type?: ProposalRequestType,
  coverLetter? : string,
  chat?: IChat[],
  status?: ApplicationStatus
  notification?: INotification,
  profile?: IUserProfile|null
  profileId?: number
  id?: number
}

export interface IStat {
  status: ApplicationStatus,
  count: number
}
