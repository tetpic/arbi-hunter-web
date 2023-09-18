import { CompensationType, Currency, EmploymentType, LanguageKnowLevel, Languages, ScheduleType } from 'types/enums'
import { ICategory } from './Common'

export interface ILanguageKnowledge {
  language : Languages, //? 'en'
  level : LanguageKnowLevel //? 'intermediate'
}


export interface IJob {
  categoriesIds: number[],
  skillsIds :  number[],
  sourcesIds :  number[],
  salary : number,
  compensation: CompensationType,
  currency : Currency,
  schedule : ScheduleType, 
  employment: EmploymentType,
  languageKnowledges : ILanguageKnowledge[],
  telegramNickname: string,
  countryId: number,
  cityId: number,
  phone : string,
  email : string,
  published? : boolean,
  isSavedByCurrentProfile?: boolean,
  categories?: ICategory[],
  commission?: number|null,
}

export interface IModeration {
  
}