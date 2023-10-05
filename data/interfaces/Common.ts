import { CategoryType, Languages } from 'types/enums'

export interface TimeStamp {
  createdAt?: string,
  updatedAt?: string,
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

export interface IVideo extends TimeStamp {
  duration: number,
  fileSize: number,
  focalPoint: any|null,
  id: number,
  mimeType: 'video/mp4'
  name: string,
  published: boolean,
  source: string,
  type: 'VIDEO',
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

export interface ISpecializationCategory extends TimeStamp {
  id: number, 
  imageId: number|null,
  showOnMain: boolean,
  color: number|null,
  importId: number|null,
  parentId: number|null,
  sort: number,
  image: string|null,
  translations: ITranslation[],
  languageCode: Languages,
  name: string,
  description: string|null,
  baseId: number,
  isMain: boolean
  vacanciesCount?: number|null,
  cvsCount?: number|null,
  newVacanciesCount?: number|null,
  newCvsCount?: number|null,
  minVacanciesSalary?: number|null,
  maxVacanciesSalary?: number|null,
  minCVsSalary?: number|null,
  maxCVsSalary?: number|null,
}


export interface CategoryTranslation extends TimeStamp {
  id: number,
  languageCode: Languages,
  name: string,
  baseId: number,
  priceDescription: string,
  shortDescription: string,
  fullDescription: string,
  audience: string,
  courseTime: string,
  requirements: string,
}

export interface ICategory extends TimeStamp, CategoryTranslation {
  categoryType: CategoryType,
  published: boolean,
  isMain: boolean,
  sort: string|null,
  description: string|null,
  color: string|null,
  imageId: number|null,
  articlesCount: string, //number
  deletedAt: string|null,
  image: IImage|null,
  translations: CategoryTranslation[],
  subscribers: number[],
  isSubscribedByCurrentProfile: boolean,
}

export interface UpdateCommunityForm {
  name: string, 
  categoryId?: number
  imageId?: number, 
  logoId?: number
}

export interface PreviewImage {
  image: Blob,
  loaded: boolean
  id: string
}



export default interface IFile {
  link: string
  focalPoint?: IFocalPoint
}

export interface IFileDownload {
  id: string
  name: string
  source: string
  type: 'IMAGE' | 'BINARY'
  fileSize: number
  focalPoint?: IFocalPoint
  authorName?: string
  metadata: {
    width?: number
    height?: number
  }
}

export interface IArticleBlock {
  id?: number,
  title?: string,
  body?: string|{[key: string]: any},
  image?: Partial<IImage>
  images?: Partial<IImage>[],
  imageLarge?: Partial<IImage>,
  imagesIds?: number[]
}

export interface ICreateNews {
  id?: number
  communityId: number,
  articleType: CategoryType,
  name: string,
  published: boolean,
  image: {id: number},
  imageIds: number[],
  blocks: IArticleBlock[]
}