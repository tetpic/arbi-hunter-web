import { Translate } from 'next-translate'
import { TranslateCompensationType, TranslateCurrency } from './enumsTranslations'
import { IVacancy } from 'data/interfaces/IVacancy'
import { ICV } from 'data/interfaces/ICV'
import { CompensationType } from 'types/enums'

export const getSalary = (data: {cv?: ICV, vacancy?: IVacancy}, t?: Translate):string|number|null => {
  const salary = data.cv&&(data.cv?.salary?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')) + ' ' + TranslateCurrency(data.cv?.currency)
  ||data.vacancy&&
    [
      data.vacancy?.salaryMin&&(`${t('from')}` + data.vacancy?.salaryMin.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') + ' ' + TranslateCurrency(data.vacancy?.currency)), 
      data.vacancy?.salaryMax&&(`${t('to')} `+ data.vacancy?.salaryMax.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') + ' ' + TranslateCurrency(data.vacancy?.currency))
    ].filter(Boolean).join(' ')
  const compensation = data.vacancy?.compensation||data.cv?.compensation

  if((!Boolean(salary?.toString()?.trim()) && compensation === CompensationType.Salary)) {
    return null
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