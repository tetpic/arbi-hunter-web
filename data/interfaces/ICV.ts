import { Answer, EducationTypes, Genders, Languages, VacancyLookType, WorkExperiencePresense } from "types/enums"
import { IJob } from "./IJob"


export interface TimeLine {
  toDate?: string, 
  fromDate?: string,
  date?: string
}

export interface IPosition {
  position: string
}

export interface ISkill {
  id: number,
  title: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string|null
}

export interface ExperienceInfo extends TimeLine {
  company: string,
  position: string,
  description: string
}

export interface EducationInfo extends TimeLine {
  institution: string,
  speciality: string
}

export interface CoursesInfo extends TimeLine {
  location: string,
  name: string
}

export interface Source {
  id: number,
  title: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string|null
}


interface Translation {
  id: number,
  createdAt: string,
  updatedAt: string,
  languageCode: Languages,
  name: string,
  description: string|null,
  baseId: number
}
export interface ICategory {
  id: number,
  createdAt: string,
  updatedAt: string,
  imageId: number|null,
  showOnMain: boolean,
  color: number|null,
  importId: number|null,
  parentId: number|null,
  sort: number,
  deletedAt: string|null,
  image: string|null,
  translations: Translation[],
  languageCode: Languages,
  name: string,
  description: string|null,
  baseId: number,
  isMain: boolean
}

export interface ICVCreate extends IJob {
  vacancyLookType : VacancyLookType,//add enums looktype
  firstName : string,
  lastName: string,
  patronymic: string,
  birthday: string, //05.02.2023
  gender? : Genders,
  workExperiencePresense: WorkExperiencePresense, //"present"?
  education: EducationTypes, //"incompleteHigher" - add enums
  relocation : Answer, // enums
  position: string,
  bio: string,
  nativeLanguage: string, //?"ru"
  experienceInfo: ExperienceInfo[],
  educationInfo: EducationInfo[],
  coursesInfo: CoursesInfo[],
}


