import { Answer, EducationTypes, Genders, Languages, VacancyLookType, WorkExperience, WorkExperiencePresense } from 'types/enums'
import { CoursesInfo, EducationInfo, ExperienceInfo, ISpecializationCategory, ISource} from './Common'
import { IJob } from './IJob'
import { IGeoName } from './ILocation'
import { IProposal } from './IProposal'
import { IUserProfile } from './IUser'

export interface ICVCreate extends IJob {
  vacancyLookType : VacancyLookType,
  firstName : string,
  lastName: string,
  patronymic: string,
  birthday: string, //05.02.2023
  gender? : Genders,
  workExperiencePresense: WorkExperiencePresense, 
  education: EducationTypes, 
  relocation : Answer, 
  position: string,
  bio: string,
  nativeLanguage: Languages, 
  experienceInfo: ExperienceInfo[],
  educationInfo: EducationInfo[],
  coursesInfo: CoursesInfo[],
  commission?: number|null,
  portfolio?: string
  experience?: WorkExperience
  searchPosition?: string
  assetsIds?: number[]
}

export interface ICVVC {
  categories: ISpecializationCategory[],
  city: IGeoName,
  commission?: number|null,
}


export interface ICV extends ICVCreate, IUserProfile{
  portfolio: string|null,
  profileId: number,
  moderationStatus: string,  // "approved/manualModeration"add enums
  moderationRejectReason: string|null,
  published: boolean,
  totalViews: string|null,
  totalProposals: string|null,
  totalApplications: string|null
  isTop: boolean,
  topPurchasedAt: string|null,
  hash: string,
  profile: IUserProfile,
  savedByProfiles: IUserProfile[],
  proposalByCurrentUser: IProposal|null,
  age: number,
  lastExperienceInfo: ExperienceInfo,
  skills?: ISource[],
  sources?: ISource[],
  geos?: ISource[],
  isRemote?:boolean
}