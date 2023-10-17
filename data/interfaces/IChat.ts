import { MessageType } from 'types/enums'
import { IUser, IUserProfile } from './IUser'
import { IPagination, Nullable } from 'types/types'
import { IImage, IPaginationRequest, TimeStamp } from './Common'
import { IProposal } from './IProposal'

export interface MessageFilterOptions {
  vacanciesId?: number[];
  type?: any // UserCvOrVacancyStatus
  search?: string
  folderId?: number ;
  onlyUnread?: boolean;
  inactive?: boolean;
  page?: number;
  limit?: number;
}

export interface IMessage extends TimeStamp {
  id?: number|string
  profileId?: number, //required
  profile?: IUserProfile,
  chatId?: number, // required
  replyToId?: number,
  message?: string,
  sid?: string, //required
  imageIds?: number[],
  voiceId?: number[],
  type?: MessageType
  pinned?: boolean
  proposal?: IProposal
  forwarded?: boolean|null
  forwardedId?: number|null
  userId?: number|null
  assets?: IImage[]
  assetsIds?: number[]
  isRead?: boolean
  pastedImages?: File[]
  voiceMessage?: File
}


export default interface IChat extends TimeStamp {
  id: number
  type: string
  name: string
  published: boolean
  notifications: boolean
  pinned: boolean
  profileId: number
  participantId: number
  lastMessageAt: string
  profile: IUserProfile
  profiles: IUserProfile[]
  participant: IUserProfile // Participant
  application: any // ApplicationModel
  lastMessage: string
  lastMessageType: string
  totalUnread: number
  last: IMessage
  proposal: IProposal
  isGroup: boolean;
  users: IUser[]
  firstReplyAt: string
  messages?: IPagination<IMessage> //?
}

export interface IChatListRequest extends IPaginationRequest{
  search?: Nullable<string>,
  // receivingPointId?: Nullable<number>,
  // dealId?: Nullable<number>,
  userId?: Nullable<number>,
}




// export default interface IChatMessage {
//   sid?: string | null
//   id?: number
//   type: ChatMessageType
//   message?: string
//   chatId?: number
//   replyTo?: IChatMessage
//   forwarded?: IChatMessage
//   pinned?: boolean
//   replyToId?: number
//   forwardedId: number
//   userId?: number | string
//   userStates?: IChatMessageUser[]
//   assets?: IFile[]
//   createdAt: string
//   dealId?: number
//   saleRequestId?: number
//   dealOfferId?: number
// }

