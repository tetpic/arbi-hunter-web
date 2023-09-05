import { Currency, HirerRole, HirerRolePermission } from "types/enums";

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