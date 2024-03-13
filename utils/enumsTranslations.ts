import { AcceptApplicationType, ApplicationBSSelectType, ApplicationStatus, CompensationType, Currency, EducationTypes, EmploymentType, Genders, HirerRole, HirerRolePermission, InterfaceLanguage, LanguageKnowLevel, Languages, PatternTypes, ProposalRequestType, ScheduleType, SearchIn, TariffType, WorkExperience } from 'types/enums'
import translateEnum from 'types/translations'

export const arrayFromEnum = (k: {[key: string|number]: string}) => {
  return [...Object.values(k)]
}


export const TranslateHirerRolePermission = (p: HirerRolePermission) => {
  switch (p) {
    case HirerRolePermission.ChangeEmail:
      return 'Изменение почты'
    case HirerRolePermission.ChangePassword:
      return 'Изменение пароля'
    case HirerRolePermission.ViewStats:
      return 'Просмотр статистики'
    case HirerRolePermission.ManageApplications:
      return 'Отклики на соискателей'
    case HirerRolePermission.CreateVacancies:
      return 'Создание и продление вакансий'
    case HirerRolePermission.EditCompanyProfile:
      return 'Изменения профиля компании'
    case HirerRolePermission.EditCompanyBlog:
      return 'Изменение блога компании'
  }
}

export const TranslateHirerRole = (p: HirerRole) => {
  switch (p) {
    case HirerRole.Admin:
      return 'Администратор'
    case HirerRole.Manager:
      return 'Менеджер'
  }
}

export const TranslateCurrency = (c: Currency) => {
  switch(c) {
    case Currency.EUR:
      return '€'
    case Currency.RUB: 
      return '₽'
    case Currency.USD:
      return '$'
    case Currency.GRN:
      return '₴'
  }
  
}

export const TranslateAcceptApplicationType = (t: AcceptApplicationType) => {
  switch (t) {
    case AcceptApplicationType.PhoneInterview:
      return 'Телефонное интервью'
    case AcceptApplicationType.Interview:
      return 'Интервью'
    case AcceptApplicationType.WorkApplication:
      return 'Предложение о работе'
    case AcceptApplicationType.GoingToWork:
      return 'Выход на работу'
    case AcceptApplicationType.Esmitate:
      return 'Оценка'
  }
}


export const TranslatePatternType = (p: PatternTypes) => {
  switch (p) {
    case PatternTypes.InfoRequest:
      return 'Запрос информации'
    case PatternTypes.Interview:
      return 'Собеседование'
    case PatternTypes.Rejection:
      return 'Отказ'
  }
}

export const TranslateGenderType = (g: Genders) => {
  switch(g) {
    case Genders.Female: 
    return 'Женский'
    case Genders.Male: 
    return 'Мужской'  
  }
}

export const TranslateEducationType = (e: EducationTypes) => {
  switch(e) {
    case EducationTypes.Bachelor:
      return 'Бакалавр'
    case EducationTypes.Doctor: 
      return 'Доктор наук'
    case EducationTypes.Higher: 
      return 'Высшее'
    case EducationTypes.IncompleteHigher: 
      return 'Неоконченное высшее'
    case EducationTypes.Master:
      return 'Магистр'
    case EducationTypes.PhD:
      return 'Кандидат наук'
    case EducationTypes.Secondary:
      return 'Среднее'
    case EducationTypes.SecondarySpecial:
      return 'Средне специальное'
  }
}

export const TranslateWorkExperience = (w: WorkExperience) => {
  switch(w) {
    case WorkExperience.NoExperience: 
      return 'Без опыта'
    case WorkExperience.From1to3:
      return 'От 1 до 3'
    case WorkExperience.From3to6:
      return 'От 3 до 6'
    case WorkExperience.From6:
      return 'Более 6 лет'
  }
}

export const TranslateCompensationType = (c: CompensationType) => {
  switch(c) {
    // case CompensationType.Commission: 
    // return 'Процент'
    case CompensationType.Contract:
      return 'Договорная'
    // case CompensationType.Gybrid: 
    //   return 'Гибрид'
    // case CompensationType.Piecework: 
    //   return 'Сдельная'
    case CompensationType.Salary:
      return 'Оклад'
    }
}

export const TranslateApplicationBSSelectType = (t: ApplicationBSSelectType) => {
  switch(t) {
    case ApplicationBSSelectType.AnotherVacancy:
      return'На другую вакансию'
    case ApplicationBSSelectType.Reject:
      return'Отказ'
    case ApplicationBSSelectType.ThisVacancy:
      return 'На эту вакансию'
  }
}

export const TranslateLanguageKnowLevel = (l: LanguageKnowLevel, lowerCase?: boolean) => {  
  switch(l) {
    case LanguageKnowLevel.Advanced :
      return lowerCase?'продвинутый': 'Продвинутый'
    case LanguageKnowLevel.Beginner :
      return lowerCase?'начинающий': 'Начинающий'
    case LanguageKnowLevel.Intermediate :
      return lowerCase?'средний': 'Средний'
    case LanguageKnowLevel.Professional :
      return lowerCase?'профессионал': 'Профессионал'
  }
}

export const TranslateProposalType = (p: ApplicationStatus) => {
  switch(p) {
    case ApplicationStatus.Accepted:
      return 'Приглашение'
    case ApplicationStatus.Applied:
      return 'Не просмотрено'
    case ApplicationStatus.Rejected:
      return 'Отказ'
  }
}

export const TranslateProposalRequestType = (p: ProposalRequestType) => {
  switch(p) {
    case ProposalRequestType.InfoRequest:
      return ''
    case ProposalRequestType.Interview:
      return 'Приглашение'
    case ProposalRequestType.New:
      return ''
    case ProposalRequestType.Rejection:
      return ''
  }
}

export const TranslateTariffType = (t: TariffType) => {
  switch(t) {
    case TariffType.Standard:
      return 'Тариф стандарт'
    case TariffType.StandardPlus:
      return 'Тариф Стандарт+'
    case TariffType.Vip:
      return 'Тариф VIP'
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

export const TranslateLanguage = (t: Languages) => {
  switch(t) {
    case Languages.en:
      return 'Английский'
    case Languages.de:
      return 'Немецкий'
    case Languages.fr:
      return 'Французский'
    case Languages.cs:
      return 'Чешский'
    case Languages.nl:
      return 'Нидерландский'
    case Languages.et:
      return 'Эфиопский'
    case Languages.pt:
      return 'Португальский'
    case Languages.it:
      return 'Итальянский'
    case Languages.ja:
      return 'Японский'
    case Languages.ko:
      return 'Корейский'
    case Languages.es:
      return 'Польский'
    case Languages.ru:
      return 'Русский'
    case Languages.zh:
      return 'Китайский'
    case Languages.lv:
      return 'Литовский'
    case Languages.uk:
      return 'Украинский'
      
  }

}

export const TranslateScheduleType = (s: ScheduleType) => {
  switch(s) {
    case ScheduleType.FullDay:
      return 'Полный день'
    case ScheduleType.Flexible:
      return 'Гибкий график'
    case ScheduleType.Remote:
      return 'Удаленная работа'

  }
}

export const TranslateEmploymentType = (e: EmploymentType) => {
  switch(e) {
    case EmploymentType.FullTime:
      return 'Полная'
    case EmploymentType.PartTime:
      return 'Частичная'
    case EmploymentType.Project:
      return 'Проектная'
  }
  
}

export const TranslateSearchInType = translateEnum(SearchIn, ['в названии вакансии', 'в названии компании'])