import { PersonalBlockType } from 'types/enums'
import { IFile, TimeStamp } from './Common'

export interface IPersonalPageBlock {
  text?: string,
  type: PersonalBlockType,
  order?: number,
  title?: string,
  assets?: number[]
  layout?: (number|string)[][]
  assetsList?: number[][]
  texts?: string[]
  titles?: string[]
}



export interface IPersonalPage extends TimeStamp {
  id : number,
  profileId : number,
  blocks : IPersonalPageBlock[],
  assets: IFile[]
}