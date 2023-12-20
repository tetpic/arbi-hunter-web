import { IFile, ITranslation, TimeStamp } from './Common'

export interface ICharCategory extends TimeStamp{
  id?: number,
  imageId?: number,
  isMain?: boolean,
  key?: string,
  newItemsCount?: number,
  parentId?: number,
  sort?: number,
  itemsCount?: string,
  name?: string,
  translations?: ITranslation[],
  image?: IFile
}

export interface ICharItem extends TimeStamp {
  id?: number,
  categoryId?: number,
  category?: ICharCategory
  image?: IFile,
  imageId?: number,
  isLocked?: boolean,
  isNew?: boolean,
  isSelectedForCharacter?: boolean,
  price?: number,
  sort?: number,
  animationKey?: string
  name?: string
  gender?: 'male'|'female',
}

export interface IUserCharacter extends TimeStamp{
  gender: 'male'|'female',
  id: number,
  items: ICharItem[],
  profileId: number
}