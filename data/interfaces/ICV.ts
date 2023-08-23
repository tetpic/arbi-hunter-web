import { Answer, Genders } from "types/enums"
import { IJob } from "./IJob"



export interface ExperienceInfo {
  toDate: string, //"08.2017"
  company: string,
  fromDate: string, //?"02.2017"
  position: string,
  description: string
}

export interface EducationInfo {
  toDate: string, //'2018'
  institution: string,
  fromDate: string, //'2018'
  speciality: string
}

export interface CoursesInfo {
  date: string, //'2028'
  location: string,
  name: string
}

export interface ICVCreate extends IJob {
  vacancyLookType : string,//add enums looktype
  firstName : string,
  lastName: string,
  patronymic: string,
  birthday: string, //05.02.2023
  gender : Genders,
  workExperiencePresense: string, //"present"?
  education: string, //"incompleteHigher" - add enums
  relocation : Answer, // enums
  position: string,
  bio: string,
  nativeLanguage: string, //?"ru"
  experienceInfo: ExperienceInfo[],
  educationInfo: EducationInfo[],
  coursesInfo: CoursesInfo[],
}