import { AcceptApplicationType, Currency, HirerRole, HirerRolePermission, PatternTypes } from "types/enums";

export const TranslateHirerRolePermission = (p: HirerRolePermission) => {
  switch (p) {
    case HirerRolePermission.ChangeEmail:
      return 'Изменение почты';
    case HirerRolePermission.ChangePassword:
      return 'Изменение пароля';
    case HirerRolePermission.ViewStats:
      return 'Просмотр статистики';
    case HirerRolePermission.ManageApplications:
      return 'Отклики на соискателей';
    case HirerRolePermission.CreateVacancies:
      return 'Создание и продление вакансий';
    case HirerRolePermission.EditCompanyProfile:
      return 'Изменения профиля компании';
    case HirerRolePermission.EditCompanyBlog:
      return 'Изменение блога компании';
  }
}

export const TranslateHirerRole = (p: HirerRole) => {
  switch (p) {
    case HirerRole.Admin:
      return 'Администратор';
    case HirerRole.Manager:
      return 'Менеджер';
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
      return 'Телефонное интервью';
    case AcceptApplicationType.Interview:
      return 'Интервью';
    case AcceptApplicationType.WorkApplication:
      return 'Предложение о работе';
    case AcceptApplicationType.GoingToWork:
      return 'Выход на работу';
    case AcceptApplicationType.Esmitate:
      return 'Оценка';
  }
}


export const TranslatePatternType = (p: PatternTypes) => {
  switch (p) {
    case PatternTypes.InfoRequest:
      return 'Запрос информации';
    case PatternTypes.Interview:
      return 'Собеседование';
    case PatternTypes.Rejection:
      return 'Отказ';
  }
}