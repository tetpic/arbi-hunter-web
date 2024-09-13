import { ProfileType } from 'data/interfaces/IRegistration'
import { Translate } from 'next-translate'
import { 
  ApplicationBSSelectType, 
  ApplicationStatus, 
  CompensationType, 
  Currency, 
  EducationTypes, 
  EmploymentType, 
  Genders, 
  HirerRole,
  HirerRolePermission, 
  InterfaceLanguage, 
  LanguageKnowLevel, 
  Languages,  
  ProposalRequestType, 
  ScheduleType,  
  SearchIn,   
  VacancyLookType, 
  WorkExperience 
} from 'types/enums'
import translateEnum from 'types/translations'

export const arrayFromEnum = (k: {[key: string|number]: string}) => {
  return [...Object.values(k)]
}


export const TranslateHirerRolePermission = (p: HirerRolePermission, t: Translate)  => {
  switch (p) {
    case HirerRolePermission.ChangeEmail:
      return t('hirerRolePermission_changeEmail')
    case HirerRolePermission.ChangePassword:
      return t('hirerRolePermission_changePassword')
    case HirerRolePermission.ViewStats:
      return t('hirerRolePermission_viewStats')
    case HirerRolePermission.ManageApplications:
      return t('hirerRolePermission_manageApplications')
    case HirerRolePermission.CreateVacancies:
      return t('hirerRolePermission_createVacancies')
    case HirerRolePermission.EditCompanyProfile:
      return t('hirerRolePermission_editCompanyProfile')
    case HirerRolePermission.EditCompanyBlog:
      return t('hirerRolePermission_editCompanyBlog')
  }
}

export const TranslateHirerRole = (p: HirerRole, t: Translate) => {
  switch (p) {
    case HirerRole.Admin:
      return t('hirerRole_admin')
    case HirerRole.Manager:
      return t('hirerRole_manager')
  }
}

export const TranslateCurrency = (c: Currency, svg?: boolean) => {
  switch(c) {
    case Currency.EUR:
      return svg?' euro':'€'
    case Currency.RUB: 
      return svg? ' руб.':'₽'
    case Currency.USD:
      return '$'
    case Currency.GRN:
      return '₴'
  }
  
}


export const TranslatePatternType = (p: ProposalRequestType, t: Translate) => {
  switch (p) {
    case ProposalRequestType.InfoRequest:
      return t('invite')
    case ProposalRequestType.Interview:
      return t('takeATest')
    case ProposalRequestType.Rejection:
      return t('rejection')
    case ProposalRequestType.Consider:
      return t('consider')

  }
}

export const TranslateGenderType = (g: Genders, t: Translate) => {
  switch(g) {
    case Genders.Female: 
    return t('female')
    case Genders.Male: 
    return t('male')  
  }
}

export const TranslateWorkExperience = (w: WorkExperience, t: Translate) => {
  switch(w) {
    case WorkExperience.NoExperience: 
      return t('workExperience_no')
    case WorkExperience.From1to3:
      return t('workExperience_from1to3')
    case WorkExperience.From3to6:
      return t('workExperience_from3to6')
    case WorkExperience.From6:
      return t('workExperience_from6')
  }
}

export const TranslateCompensationType = (c: CompensationType, t?: Translate) => {
  switch(c) {
    case CompensationType.Contract:
      return t?.('compensation_contract')||'Договорная'
    case CompensationType.Salary:
      return t?.('compensation_salary')||'Зарплата'
    }
}

export const TranslateApplicationBSSelectType = (type: ApplicationBSSelectType, t: Translate) => {
  switch(type) {
    case ApplicationBSSelectType.AnotherVacancy:
      return t('onOtherVacancy')
    case ApplicationBSSelectType.Reject:
      return t('rejection')
    case ApplicationBSSelectType.ThisVacancy:
      return t('onThisVacancy')
  }
}

export const TranslateLanguageKnowLevel = (l: LanguageKnowLevel, t: Translate, lowerCase?: boolean, ) => {  
  switch(l) {
    case LanguageKnowLevel.Advanced :
      return lowerCase?t('languageKnowLevel_advanced').toLowerCase(): t('languageKnowLevel_advanced')
    case LanguageKnowLevel.Beginner :
      return lowerCase?t('languageKnowLevel_beginner').toLowerCase(): t('languageKnowLevel_beginner')
    case LanguageKnowLevel.Intermediate :
      return lowerCase?t('languageKnowLevel_intermediate').toLowerCase(): t('languageKnowLevel_intermediate')
    case LanguageKnowLevel.Professional :
      return lowerCase?t('languageKnowLevel_professional').toLowerCase(): t('languageKnowLevel_professional')
  }
}

export const TranslateProposalType = (p: ApplicationStatus, t: Translate) => {
  switch(p) {
    case ApplicationStatus.Accepted:
      return t('invite')
    case ApplicationStatus.Applied:
      return t('profile_feedbacks_paused')
    case ApplicationStatus.Rejected:
      return t('rejection')
  }
}

export const TranslateInterfaceLanguage = (t: InterfaceLanguage) => {
  switch(t) {
    case InterfaceLanguage.English:
      return 'English'
    case InterfaceLanguage.Russian: 
      return 'Русский'
    case InterfaceLanguage.Ukranian:
      return 'Українська'
  }
}

export const TranslateLanguage = (l: Languages, t: Translate) => {
  switch(l) {
    case Languages.en:
      return t('language_en')
    case Languages.de:
      return t('language_de')
    case Languages.fr:
      return t('language_fr')
    case Languages.cs:
      return t('language_cs')
    case Languages.nl:
      return t('language_nl')
    case Languages.et:
      return t('language_et')
    case Languages.pt:
      return t('language_pt')
    case Languages.it:
      return t('language_it')
    case Languages.ja:
      return t('language_ja')
    case Languages.ko:
      return t('language_ko')
    case Languages.es:
      return t('language_es')
    case Languages.ru:
      return t('language_ru')
    case Languages.zh:
      return t('language_zh')
    case Languages.lv:
      return t('language_lv')
    case Languages.uk:
      return t('language_uk')
      
  }

}

export const TranslateScheduleType = (s: ScheduleType, t: Translate) => {
  switch(s) {
    case ScheduleType.FullDay:
      return t('schedule_fullDay')
    case ScheduleType.Flexible:
      return t('schedule_flexible')
    case ScheduleType.Remote:
      'schedule_remote'
      return t('schedule_remote')
  }
}

export const TranslateEmploymentType = (e: EmploymentType, t: Translate, full?: boolean) => {
  switch(e) {
    case EmploymentType.FullTime:
      return full?t('employment_fullTimeAlt'):t('employment_fullTime')
    case EmploymentType.PartTime:
      return full?t('employment_partTimeAlt'):t('employment_partTime')
    case EmploymentType.Project:
      return full?t('employment_projectAlt'):t('employment_project')
  }
}


export const TranslateEducationType = (e: EducationTypes, t: Translate) => {
  switch(e) {
    case EducationTypes.Secondary:
      return t('education_secondary')
    case EducationTypes.SecondarySpecial:
      return t('education_secondarySpecial')
    case EducationTypes.IncompleteHigher:
      return t('education_incompleteHigher')
    case EducationTypes.Higher:
      return t('education_higher')
    case EducationTypes.Bachelor:
      return t('education_bachelor')
    case EducationTypes.Master:
      return t('education_master')
    case EducationTypes.PhD:
      return t('education_phD')
    case EducationTypes.Doctor:
      return t('education_doctor')
    default: 
      return t('education_noEducation')
  }
}

export const TranslateVacancyLookType = (v: VacancyLookType, profileType: ProfileType, t: Translate) => {
  switch(v) {
    case VacancyLookType.ActivelyLooking:
      return profileType===ProfileType.Employee? t('vacancyLookType_activelyLooking'): t('vacancyLookType_activelyLookingAlt')
    case VacancyLookType.NotLooking:
      return profileType === ProfileType.Employee? t('vacancyLookType_notLooking'): t('vacancyLookType_notLookingAlt')
    case VacancyLookType.PassivelyLooking:
      return profileType === ProfileType.Employee? t('vacancyLookType_passivelyLooking'): t('vacancyLookType_passivelyLookingAlt')
  }
}

export const TranslateSearchInType = (t: Translate) =>  {return translateEnum(SearchIn, ['searchInVacancyName', 'searchInCompanyName'], t)}

