import { PersonalBlockType } from 'types/enums'
import { IFile, TimeStamp } from './Common'

export interface IPersonalPageBlock {
  text?: string,
  type: PersonalBlockType,
  order?: number,
  title?: string,
  assets?: number[]
  layout?: any
  assetsList?: number[][]
}



export interface IPersonalPage extends TimeStamp {
  id : number,
  profileId : number,
  blocks : IPersonalPageBlock[],
  assets: IFile[]
}