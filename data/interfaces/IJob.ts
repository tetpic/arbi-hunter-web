import { CompensationType, Currency } from "types/enums";

export interface LanguageKnowledge {
  language : string, //? 'en'
  level : string //? 'intermediate'
}


export interface IJob {
  categoriesIds: [1],//?
  skillsIds :  [1,2],//?
  sourcesIds :  [1,2],//?
  salary : number,
  compensation: CompensationType,
  currency : Currency,
  schedule : string, //? add enum "fullDay"
  employment: string,//?add enum "fullTime"
  languageKnowledges : LanguageKnowledge[],
  telegramNickname: string,
  countryId: number,
  cityId: number,
  phone : string,
  email : string,
  published : boolean,
}