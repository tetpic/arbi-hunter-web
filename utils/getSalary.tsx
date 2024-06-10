import { Translate } from 'next-translate'
import { TranslateCompensationType, TranslateCurrency } from './enumsTranslations'
import { IVacancy } from 'data/interfaces/IVacancy'
import { ICV } from 'data/interfaces/ICV'
import { CompensationType } from 'types/enums'

export const getSalary = (data: {cv?: ICV, vacancy?: IVacancy}, t?: Translate):string|number|null => {
  const salary = data.cv&&Number(data.cv?.salary.toString() + ' ' + TranslateCurrency(data.cv?.currency, true))
  ||data.vacancy&&
    [
      data.vacancy?.salaryMin&&('от '+ data.vacancy?.salaryMin.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') + TranslateCurrency(data.vacancy?.currency, true)), 
      data.vacancy?.salaryMax&&('до '+ data.vacancy?.salaryMax.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') + TranslateCurrency(data.vacancy?.currency, true))
    ].filter(Boolean).join(' ')
  const compensation = data.vacancy?.compensation||data.cv?.compensation
  

  if((!Boolean(salary?.toString()?.trim()) && compensation === CompensationType.Salary)) {
    return salary
  }

  switch(compensation) {
    case CompensationType.Contract:
      return TranslateCompensationType(compensation, t)
    case CompensationType.Salary:
      return salary
    default: 
      return salary
  }
}