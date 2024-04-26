import { TimeStamp } from './Common'
import { IUserProfile } from './IUser'

export interface IFolder 
extends Pick<TimeStamp, 
'createdAt'|
'updatedAt'|
'deletedAt'> {
  default: boolean,
  id: number,
  name: string,
  profileId: number,
  savedCvCount: number
  profile: IUserProfile
}

export interface IFolderCreate {
  name: string, 
  default: boolean
}