import { Languages } from 'types/enums'
import { CategoryTranslation,IImage, IVideo} from './Common'

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
