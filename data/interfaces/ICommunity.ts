import { IImage, TimeStamp } from './Common'
import { IUser, IUserProfile } from './IUser'

export default interface ICommunity extends TimeStamp {
  id: number,
  profileId: number,
  name: string,
  imageId: number|null,
  logoId: number|null,
  image: IImage|null,
  profile: IUserProfile,
  logo: IImage|null,
  members: IUser[],
  isSubscribedByCurrentProfile: false,
  membersCount: string
}