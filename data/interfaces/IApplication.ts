import { ApplicationStatus, PatternTypes } from 'types/enums'
import { TimeStamp } from './Common'
import { ICV } from './ICV'
import { INotification } from './INotification'
import { IUserProfile } from './IUser'
import { IVacancy } from './IVacancy'
import { IProposal } from './IProposal'
import IChat from './IChat'

export interface IApplication extends TimeStamp{
  id: number,
  vacancyId?: number,
  cvId: number,
  profileId: number,
  status: ApplicationStatus, //"applied"
  coverLetter: string,
  vacancy: IVacancy,
  profile: IUserProfile,
  cv: ICV,
  proposals: [],
  proposal?: IProposal
  chat: IChat[],
  notification: INotification
  type?: PatternTypes
  cvDeletedOrHidden?: boolean

}


