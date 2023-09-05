import { CategoryType } from "types/enums"
import { IImage, ITranslation, TimeStamp } from "./Common"

export interface IArticleCategory extends TimeStamp {
  id: number,   
  categoryType: CategoryType,
  published: boolean,
  isMain: boolean,
  sort: number|null,
  description: string|null,
  color: string|null,
  imageId: string|number|null,
  translations: ITranslation[]
}

export interface IArticle extends TimeStamp {
  id: 27,
  articleCategoryId: number,
  articleType: CategoryType,
  name: string,
  shortDescription: string|null,
  imageId: number,
  minutesToRead: number,
  totalViews: number,
  published: boolean,
  authorName: string|null,
  likesCount: string,
  publishedAt: string|null,
  adminUpdatedAt: string,
  adminId: number,
  communityId: number|null,
  courseId: number|null,
  orderCategory: null,
  order: null, 
  isTop: boolean,
  "image": IImage, 
  "images": IImage[],
  "articleCategory": IArticleCategory,
  community: null,//???
  likes: [],//???
  savedByProfiles: [],//???
  isSavedByCurrentProfile: boolean,
  isLikedByCurrentProfile: boolean,
  imagesIds: []//???
}