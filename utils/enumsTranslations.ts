import { AcceptApplicationType, Currency, EducationTypes, Genders, HirerRole, HirerRolePermission, PatternTypes, WorkExperience } from 'types/enums'

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
    case WorkExperience.From1to3:
      return 'От 1 до 3'
    case WorkExperience.From3to6:
      return 'От 3 до 6'
    case WorkExperience.From6:
      return 'Более 6 лет'
  }
}

