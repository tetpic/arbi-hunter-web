import { CompensationType, Currency, LanguageKnowLevel } from "types/enums";

export interface ILanguageKnowledge {
  language : string, //? 'en'
  level : LanguageKnowLevel //? 'intermediate'
}


export interface IJob {
  categoriesIds: number[],//?
  skillsIds :  number[],//?
  sourcesIds :  number[],//?
  salary : number,
  compensation: CompensationType,
  currency : Currency,
  schedule : string, //? add enum "fullDay"
  employment: string,//?add enum "fullTime"
  languageKnowledges : ILanguageKnowledge[],
  telegramNickname: string,
  countryId: number,
  cityId: number,
  phone : string,
  email : string,
  published : boolean,
}