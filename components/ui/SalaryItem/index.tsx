import { IVacancy } from 'data/interfaces/IVacancy'
import Image from 'next/image'
import { CompensationType } from 'types/enums'
import { TranslateCompensationType, TranslateCurrency} from 'utils/enumsTranslations'
// import Formatter from 'utils/formatter'
import styles from './index.module.scss'
import { ICV } from 'data/interfaces/ICV'
import Formatter from 'utils/formatter'

interface Props {
  vacancy?: IVacancy
  cv?: ICV
}

export default function SalaryItem({vacancy, cv}: Props) {

  const salary = cv&&(Formatter.formatNumber(Number(cv?.salary)) + ' ' + TranslateCurrency(cv?.currency))||vacancy&&[vacancy?.salaryMin&&('от '+ Formatter.formatNumber(vacancy?.salaryMin) + TranslateCurrency(vacancy?.currency)), vacancy?.salaryMax&&('до '+Formatter.formatNumber(vacancy?.salaryMax) + TranslateCurrency(vacancy?.currency))].filter(Boolean).join(' ')
  const compensation = vacancy?.compensation||cv?.compensation
  const currency = vacancy?.currency||cv?.currency
  const commission = vacancy?.commission||cv?.commission

  const image =   <Image src={'/icons/money.png'} width={24} height={24} alt={'money icon'}/> 



  if(!Boolean(salary.trim())) {
    return null
  }

  return (<p className={styles.salary}>
  {
  // compensation === CompensationType.Salary && salary &&
  // <>
  //   {image}
  //   <span>от {Formatter.formatNumber(Number(salary))} {TranslateCurrency(currency)}</span>
  // </>
  // ||
  // compensation === CompensationType.Piecework && 
  // <>
  //   {image}
  //   <span>{TranslateCompensationType(compensation)} ({TranslateCurrency(currency)})</span>
  // </>
  // ||
  // compensation === CompensationType.Commission && commission &&
  // <>
  //   {image}
  //   <span>{commission}% ({TranslateCurrency(currency)})</span>
  // </>
  // ||
  compensation === CompensationType.Contract &&  
  <span> {TranslateCompensationType(compensation)}</span>
  ||
  <>
  {image}
  <span>{salary}</span>
  </>

  // ||
  // compensation === CompensationType.Gybrid && 
  // <>
  //   {image}
  //   <span>{salary && Formatter.formatNumber(Number(salary)) + ' ' + TranslateCurrency(currency) + ' + ' } {commission}%</span>
  // </>
  }
 </p>)
}