import { Answer, EducationTypes, Genders } from "types/enums"
import { IJob } from "./IJob"


interface TimeLine {
  toDate: string, 
  fromDate: string,
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

export interface CoursesInfo {
  date: string, //'2028'
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

export interface ICVCreate extends IJob {
  vacancyLookType : string,//add enums looktype
  firstName : string,
  lastName: string,
  patronymic: string,
  birthday: string, //05.02.2023
  gender? : Genders,
  workExperiencePresense: string, //"present"?
  education: EducationTypes, //"incompleteHigher" - add enums
  relocation : Answer, // enums
  position: string,
  bio: string,
  nativeLanguage: string, //?"ru"
  experienceInfo: ExperienceInfo[],
  educationInfo: EducationInfo[],
  coursesInfo: CoursesInfo[],
}

