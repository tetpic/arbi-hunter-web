import { TimeStamp } from './Common'
import { IUserProfile } from './IUser'

export interface IView extends TimeStamp {
  profile: IUserProfile,
  id: number
  isRead: boolean
  profileId: number
}