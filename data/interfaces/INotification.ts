import { DataNotifyType } from 'types/enums'
import { TimeStamp } from './Common'
import { IUser } from './IUser'

export interface INotification extends TimeStamp{
    id: number,
    type: DataNotifyType,
    channels: string[], //'alert','push','email',
    userId: number,
    targetType: string, //"user"
    scheduleSentAt: null,
    adminId: number|null,
    priority: number|null,
    timeToLive: number|null,
    color: string|null,
    icon: string|null,
    tag: string|null,
    sound: string|null,
    data: {
        applicationId: number
    },
    messageId: number|null,
    applicationId: 250,
    proposalId: number|null,
    vacancyId: number|null,
    cvId: number|null,
    readedByUsers: IUser|IUser[],
    targetTypeName: string // "Одному пользователю"
}

export enum ItemsNotificationType {
    ChatMessage = 'chatMessage',
    Admin = 'admin',
    NewApplication = 'newApplication',
    NewProposal = 'newProposal',
    UserRegistered = 'userRegistered',
    UserBlocked = 'userBlocked',
    UserUnBlocked = 'userUnBlocked',
    CvRejected = 'cvRejected',
    VacancyRejected = 'vacancyRejected'
}