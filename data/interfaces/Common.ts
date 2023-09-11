import { Languages } from 'types/enums'

export interface TimeStamp {
  createdAt: string,
  updatedAt: string,
  deletedAt?: string|null
}

export interface TimeLine {
  toDate?: string, 
  fromDate?: string,
  date?: string
}

export interface IPosition {
  position: string
}

export interface ISource extends TimeStamp {
  id: number,
  title: string,
}

export interface ExperienceInfo extends TimeLine {
  company: string,
  position: string,
  description: string
}

export interface EducationInfo extends TimeLine {
  institution: string,
  speciality: string
}

export interface CoursesInfo extends TimeLine {
  location: string,
  name: string
}

export interface ITranslation extends TimeStamp {
  id: number,
  languageCode: Languages,
  name: string,
  description: string|null,
  baseId: number
}

export interface IFocalPoint {
  x: string,
  y: string
}

export interface IImage extends TimeStamp {
  id: number,
  published: boolean,
  name: string,
  type: 'IMAGE',
  mimeType: 'image/png',
  fileSize: number,
  duration: string|number|null,
  source: string,
  focalPoint: IFocalPoint,
  userId: number|null
}

export interface IChat extends  TimeStamp { 
  id: number,
  type: 'chat',
  name: string|null,
  isGroup: boolean,
  profileId: number,
  participantId: number,
  applicationId: number,
  proposalId: number|null,
  lastMessageAt: string,
}