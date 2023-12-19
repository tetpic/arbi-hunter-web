import { IImage, TimeStamp } from './Common'

export interface IPersonalPageBlock {
  text: string,
  type: 'location'|'text'|'gallery'|'banner',
  order: number,
  title: string,
  assets: number[]
}



export interface IPersonalPage extends TimeStamp {
  id : 99,
  profileId : 294,
  blocks : IPersonalPageBlock[],
  assets: IImage[]
}