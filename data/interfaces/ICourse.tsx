import { Languages } from 'types/enums'
import { CategoryTranslation,IImage, IVideo, TimeStamp} from './Common'
import { IUserProfile } from './IUser'

export interface CoursesData {
  page?: number|null, 
  limit?: number|null, 
  isStarted?: boolean|null, 
  search?: string|null, 
  categories?: number[]|null
}

export interface IAuthor {
  description: string,
  id: number,
  image: IImage,
  name: string
}

export default interface ICourse extends CategoryTranslation {
  price: number,
  currency: string,
  language: Languages,
  imageId: number,
  authors: IAuthor[]
  videoId: number|null,
  video: IVideo|null
  published: boolean,
  withCertificate: boolean|null,
  rating: number|null,
  blocksCount: string|null,//number
  stepsCount: string|null,//number
  completedCount: number|null,
  feedbackCount: number|null,
  adminUpdatedAt: string,
  adminId: number,
  deletedAt: string|null,
  image: IImage,
  categoriesIds: number[],
  benefits: string,
  translations: CategoryTranslation[]
}

export interface ICourseBlockTranslation extends TimeStamp {
  id: number,
  languageCode: Languages,
  title: string,
  body: string,
  blockTime: string,
  priceDescription: string|null,
  baseId: number,
}

export interface ICourseBlock extends ICourseBlockTranslation {
  courseId: number,
  order: number,
  courseModuleId: number|null,
  stepsCount: string,
  completedStepsCount: string,
  progress: number,
  image: IImage,
  imageLarge: IImage,
  translations: ICourseBlockTranslation[],
}

export interface ICourseStep extends ICourseBlockTranslation{
  stepType: 'info',
  answerType: null,
  courseBlockId: 20,
  order: 0,
  image: IImage,
  courseBlock: ICourseBlock,
  translations: ICourseBlockTranslation[],
  answers: [],
}

export interface ICourseFeedback extends TimeStamp {
  id: number,
  profileId: number,
  courseId: number,
  mark: number,
  content: string,
  course:ICourse,
  profile: IUserProfile
}