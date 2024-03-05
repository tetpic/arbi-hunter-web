import { Answer, CategoryType, CompensationType, Currency, EducationTypes, EmploymentType, Genders, Languages, ScheduleType, SearchIn, VacancyLookType, WorkExperience } from 'types/enums'
import { ILanguageKnowledge } from './IJob'

export interface TimeStamp {
  createdAt?: string,
  updatedAt?: string,
  deletedAt?: string|null
  publishedAt?: string|null
}

export interface TimeLine {
  toDate?: string, 
  fromDate?: string,
  date?: string,
  toPresent?: boolean
}

export interface IPosition {
  position: string
}

export interface ISource extends TimeStamp {
  id: number,
  title: string,
}

export interface ICategorySearchParams {
  withVacanciesCount: boolean,
  key: 'sub-other'|'other'
  withCVsCount: boolean,
  withNewVacanciesCount: boolean,
  withNewCVsCount: boolean,
  intervalInDays: boolean,
  search: string, 
  page: number, 
  limit: number
}

export interface ExperienceInfo extends TimeLine {
  company: string,
  position: string,
  description: string
}

export interface EducationInfo extends TimeLine {
  institution: string,
  speciality: string,
  faculity: string
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
  x: number,
  y: number
}

export interface IFile extends TimeStamp {
  id: number,
  published?: boolean,
  name?: string,
  type?: 'IMAGE'|'VIDEO'|'BINARY',
  mimeType?: 'image/png'|'video/mp4'|'application/pdf',
  fileSize?: number,
  duration?: number|null,
  source: string,
  focalPoint?: IFocalPoint,
  userId?: number|null
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

// export interface IChat extends  TimeStamp { 
//   id: number,
//   type: 'chat',
//   name: string|null,
//   isGroup: boolean,
//   profileId: number,
//   profile: IUserProfile,
//   participantId: number,
//   participant: IUserProfile,
//   applicationId: number,
//   proposalId: number|null,
//   proposal: IApplication
//   last: IApplication
//   lastMessageAt: string,
// }

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
  withGeos?: boolean,
  withSources?: boolean,
  
}


export interface CategoryTranslation extends TimeStamp {
  id?: number,
  languageCode: Languages,
  name?: string,
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
  articlesCount?: string, //number
  deletedAt: string|null,
  image?: IFile|null,
  translations: CategoryTranslation[],
  subscribers: number[],
  isSubscribedByCurrentProfile: boolean,
  coursesCount?: string|number
}

export interface UpdateCommunityForm {
  name: string, 
  categoryId?: number
  imageId?: number, 
  logoId?: number
}

export interface PreviewImage {
  image?: Blob,
  source?: string
  loaded: boolean
  id: string|number
  rawId?: string
  data?: IFile
  mimeType?: string
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
  body?: string|TrustedHTML,
  image?: Partial<IFile>
  images?: Partial<IFile>[],
  imageLarge?: Partial<IFile>,
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

export interface IPaginationRequest {
  page?: number;
  limit?: number;
}



export interface IVacancyCvSearchParams {
  search?: string,
  keywords?: string,
  searchCompany?: string,
  searchIn?: SearchIn,
  categories?: number[] 
  geos?: number[] 
  verticals?: number[] 
  sources?: number[],
  cities?: number[] 
  countries?: number[],
  employment?: EmploymentType[],
  schedule?: ScheduleType[],
  experience?: WorkExperience[],
  currency?: Currency,
  salaryMin?: number|string,
  salaryMax?: number|string,
  commissionMin?: number,
  commissionMax?: number,
  gybridCommissionMin?: number,
  gybridCommissionMax?: number,
  skills?: number[] // '1,2,3'
  isRemote?: boolean,
  savedByCurrentProfile?: boolean,
  ids?: number[], // '1,2,3' по списку идентификаторов
  sort?: 'createdAt,DESC',
  compensation?: CompensationType,
  languageKnowledges?: ILanguageKnowledge[],
  withCharacter?: boolean,
  forLastNumberOfDays?: 1|7|30|365, 
  s?:string
  lookType?: VacancyLookType,
  countryIds?: number[],
  cityIds?: number[],
  education?: EducationTypes[],
  gender?: Genders[],
  vacancyLookType?: VacancyLookType[]
  relocation?: Answer[],
  ageMin?: number,
  ageMax?: number,
  exclude?: string,

}