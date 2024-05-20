import { ApplicationStatus, MessageType } from 'types/enums'
import { IUser, IUserProfile } from './IUser'
import { IPagination, Nullable } from 'types/types'
import { IFile, IPaginationRequest, TimeStamp } from './Common'
import { IProposal } from './IProposal'
import { IApplication } from './IApplication'

export interface MessageFilterOptions {
  vacanciesIds?: string;
  applicationStatus?: ApplicationStatus
  search?: string
  chatFolderId?: number ;
  onlyUnread?: boolean;
  inactive?: boolean;
  page?: number;
  limit?: number;
}

export interface IMessage extends TimeStamp {
  application?: IProposal
  id?: number|string
  profileId?: number,
  profile?: IUserProfile,
  chatId?: number, 
  replyTo?:  Omit<IMessage, 'forwarded'|'forwardedId'|'replyTo'|'replyToId'>|null
  replyToId?: number,
  message?: string,
  sid?: string,
  imageIds?: number[],
  voiceId?: number[],
  type?: MessageType
  pinned?: boolean
  proposal?: IProposal
  forwarded?: Omit<IMessage, 'forwarded'|'forwardedId'|'replyTo'|'replyToId'>|null
  forwardedId?: number|null
  userId?: number|null
  assets?: IFile[]
  assetsIds?: number[]
  isRead?: boolean
  pastedImages?: File[]
  voiceMessage?: File
}

export interface IChatFolder extends TimeStamp {
  id: number,
  name: string,
  notifications: boolean,
  pinned: boolean
  profile: IUserProfile,
  totalUnread: string
}

export interface IChatProfile extends TimeStamp {
  chatFolderId: number,
  chatId: number,
  deleted: boolean,
  id: number,
  notifications: boolean,
  pinned: boolean,
  profileId: number,
  role: string
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
  profiles: IChatProfile[]
  participant: IUserProfile 
  application: IApplication
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
  userId?: Nullable<number>,
}

export interface IChatsFilter {
  vacanciesIds: number[],
  status: 'all' | ApplicationStatus,
  unreaded: boolean
  inactive: boolean
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

