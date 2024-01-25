import { Answer, CompensationType, Currency, EmploymentType, LanguageKnowLevel, Languages, ScheduleType } from 'types/enums'
import { ISpecializationCategory } from './Common'

export interface ILanguageKnowledge {
  language : Languages, //? 'en'
  level : LanguageKnowLevel //? 'intermediate'
}


export interface IJob {
  categoriesIds: number[],
  skillsIds :  number[],
  sourcesIds :  number[],
  geosIds?: number[],
  salary : number|string,
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
  categories?: ISpecializationCategory[],
  commission?: number|null,
  businessTrips?: Answer
}

export interface IModeration {
  
}