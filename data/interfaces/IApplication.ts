import { ApplicationStatus,  ProposalRequestType } from 'types/enums'
import { TimeStamp } from './Common'
import { ICV } from './ICV'
import { INotification } from './INotification'
import { IUserProfile } from './IUser'
import { IVacancy } from './IVacancy'
import { IProposal } from './IProposal'
import IChat from './IChat'

export interface IApplication extends TimeStamp{
  chat: IChat[],
  cv: ICV,
  cvDeletedOrHidden?: boolean
  cvId: number,
  deletedByEmployee?: boolean
  id: number,
  proposals: IProposal[],
  proposal?: IProposal
  profile: IUserProfile,
  profileId: number,
  vacancyId?: number,
  vacancy: IVacancy,
  status: ApplicationStatus, //"applied"
  coverLetter: string,
  notification: INotification
  type?: ProposalRequestType
  vacancyDeletedOrHidden?: boolean
  applicationId?:number
}


