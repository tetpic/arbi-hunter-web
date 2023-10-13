import { MessageType } from 'types/enums'

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

export interface IMessage {
  profileId: number,
  chatId: number,
  replyToId: number,
  message: string,
  sid: string,
  imageIds: number[],
  voiceId: number[],
  type: MessageType
}

