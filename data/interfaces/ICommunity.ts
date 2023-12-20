import { IFile, TimeStamp } from './Common'
import { IUser, IUserProfile } from './IUser'

export default interface ICommunity extends TimeStamp {
  id: number,
  profileId: number,
  name: string,
  imageId: number|null,
  logoId: number|null,
  image: IFile|null,
  profile: IUserProfile,
  logo: IFile|null,
  members: IUser[],
  isSubscribedByCurrentProfile: boolean,
  membersCount: string
}