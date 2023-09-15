import { ApplicationStatus, PatternTypes } from 'types/enums'
import { IChat, TimeStamp } from './Common'
import { ICV } from './ICV'
import { INotification } from './INotification'
import { IUserProfile } from './IUser'
import { IVacancy } from './IVacancy'

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
  chat: IChat[],
  notification: INotification
  type?: PatternTypes
}


