import { CoursesStepType, CourseStepAnswerType, Languages } from 'types/enums'
import { CategoryTranslation,ICategory,IFile, IVideo, TimeStamp} from './Common'
import { IUserProfile } from './IUser'

export interface CoursesData {
  page?: number|null, 
  limit?: number|null, 
  isStarted?: boolean|null, 
  search?: string|null, 
  categories?: number[]|null
  started?: boolean,
  savedByCurrentProfile?: boolean
}

export interface IAuthor {
  description: string,
  id: number,
  image: IFile,
  name: string
}

export interface IStepVariantTranslation {
  answer: string,
  languageCode: Languages,
}

export interface IStepVariant extends IStepVariantTranslation {
  correct: boolean,
  id: string,
  translations: IStepVariantTranslation[]
}

export interface ICertificate extends IFile {

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
  image: IFile,
  categoriesIds: number[],
  categories?: ICategory[]
  benefits: string,
  translations: CategoryTranslation[],
  certificate: ICertificate
  isSavedByCurrentProfile?: boolean
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
  image: IFile,
  imageLarge: IFile,
  translations: ICourseBlockTranslation[],
}

export interface ICourseStepAnswer extends TimeStamp {
  courseBlockStepId?: number,
  answers?: number[],
  id?: number,
  userId?: number,
}

export interface ICourseStep extends ICourseBlockTranslation{
  stepType: CoursesStepType,
  answerType: CourseStepAnswerType|null,
  answer?: ICourseStepAnswer[]
  courseBlockId: 20,
  order: 0,
  image: IFile,
  courseBlock: ICourseBlock,
  translations: ICourseBlockTranslation[],
  answers: ICourseStepAnswer[],
  variants?: IStepVariant[]
}

export interface ICouseStat {
  mark: number,
  count: string
}

export interface  ICourseStats {
  count: number,
  raiting: {
      raiting: number
  },
  stats: ICouseStat[]
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

