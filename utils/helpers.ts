import { ProfileType } from 'data/interfaces/IRegistration'
import { IUserProfile } from 'data/interfaces/IUser'
import { FILES } from 'types/constants'
import Formatter from './formatter'
import { IVacancy } from 'data/interfaces/IVacancy'
import { ICV } from 'data/interfaces/ICV'
import { TranslateCompensationType, TranslateCurrency } from './enumsTranslations'
import { CompensationType } from 'types/enums'

export const getUserImageSource = (userProfile: IUserProfile): string|null => {
  switch(userProfile?.profileType) {
    case ProfileType.Employee:
      if(userProfile.useOwnLogo && userProfile.logo){
        return FILES + userProfile.logo.source
      }
      else if(!userProfile.useOwnLogo && userProfile?.image){
        return FILES + userProfile?.image?.source
      }
      else {
        return null
      }
    case ProfileType.Hirer:
      if(userProfile.logo){
        return FILES + userProfile.logo.source
      }
      else {
        return null
      }
    default:
      return null
  }
}

export const shareData = async(data: ShareData) => { 
  try{
    await navigator.share(data)
  }
  catch( err) {
    // eslint-disable-next-line no-console
    console.warn(err)
  }
}

export const clearObject = <T>(obj: T, type?: 'string' | 'array') => {
  const clearedQuery: {[key: string]: any} = {...obj}
  if(type === 'string') {
    Object.entries(clearedQuery).forEach(([key, value]) => {
      if(!Boolean(value) || (typeof value === 'string' && value.trim().length === 0)) delete clearedQuery[key]
    })
    
  }
  else{    
    Object.entries(clearedQuery).forEach(([key, value]) => {
      if(value===null
      ||value===undefined
      ||value===0
      ||(Array.isArray(value) && value.length === 0)  
      ||(typeof value === 'string' && value.trim().length === 0)
      // ||Object.keys(value).length === 0
      // ||Object.values(value).filter(Boolean).length === 0
      ) delete clearedQuery[key]
    })
  }

  return clearedQuery as T
}

export const getAge = (age: number): string => {
  if(!age) {
    return null
  }
  return age + ' ' + Formatter.pluralize(age, 'год', 'года', 'лет')
}

export const getSalary = (data: {cv?: ICV, vacancy?: IVacancy}):string|null => {
  const salary = data.cv&&(Formatter.formatNumber(Number(data.cv?.salary)) + ' ' + TranslateCurrency(data.cv?.currency))
  ||data.vacancy&&
    [
      data.vacancy?.salaryMin&&('от '+ Formatter.formatNumber(data.vacancy?.salaryMin) + TranslateCurrency(data.vacancy?.currency)), 
      data.vacancy?.salaryMax&&('до '+Formatter.formatNumber(data.vacancy?.salaryMax) + TranslateCurrency(data.vacancy?.currency))
    ].filter(Boolean).join(' ')
  const compensation = data.vacancy?.compensation||data.cv?.compensation
  

  if((!Boolean(salary?.trim()) && compensation === CompensationType.Salary) || !salary) {
    return null
  }

  switch(compensation) {
    case CompensationType.Contract:
      return TranslateCompensationType(compensation)
    case CompensationType.Salary:
      return salary
    default: 
      return salary
  }
}

export const getUserName = (profile: IUserProfile):string => {
  return [profile?.firstName, profile?.patronymic, profile?.lastName].filter(Boolean).join(' ')
}

export function copyToClipboard(text: string):boolean {
  const el = document.createElement('textarea')  // Создаем элемент textarea
  el.value = text  // Присваиваем указанный текст элементу textarea
  document.body.appendChild(el)  // Добавляем элемент в DOM
  el.select()  // Выделяем текст в элементе
  el.setSelectionRange(0, 9999)  // Выделяем текст в элементе
  document.execCommand('copy')  // Копируем выделенный текст в буфер обмена
  navigator.clipboard?.writeText(el.value)
  document.body.removeChild(el) 
  return true // Убираем элемент из DOM
}