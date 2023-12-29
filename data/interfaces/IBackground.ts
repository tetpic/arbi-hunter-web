import { IFile, TimeStamp } from './Common'
import { ProfileType } from './IRegistration'

export enum BackgroundCategoryType {
  Buildings = 1,
  Places = 2,
  Transport = 3,
  Weather = 4
}

export interface BackgroundCategory extends TimeStamp {
  id: BackgroundCategoryType,
  imageId: number|null,
  sort: number|null,
  key: number|null,
  parentId: number|null,
  isMain: boolean
}

export interface IBackground extends TimeStamp {
  id: number,
  categoryId: BackgroundCategoryType,
  profileType: ProfileType,
  backgroundType: 'png'|'rive',
  sort: number|null,
  riveKeys: string[],
  imageId: number,
  image: IFile,
  category: BackgroundCategory
}