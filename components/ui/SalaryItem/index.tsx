import { IVacancy } from 'data/interfaces/IVacancy'
import Image from 'next/image'
import { CompensationType } from 'types/enums'
import { TranslateCompensationType} from 'utils/enumsTranslations'
// import Formatter from 'utils/formatter'
import styles from './index.module.scss'
import { ICV } from 'data/interfaces/ICV'

interface Props {
  vacancy?: IVacancy
  cv?: ICV
}

export default function SalaryItem({vacancy, cv}: Props) {

  const salary = vacancy?.salary||cv?.salary
  const compensation = vacancy?.compensation||cv?.compensation
  const currency = vacancy?.currency||cv?.currency
  const commission = vacancy?.commission||cv?.commission

  const image =   <Image src={'/icons/money.png'} width={24} height={24} alt={'money icon'}/> 



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
    <span>{TranslateCompensationType(compensation)}</span>
  // ||
  // compensation === CompensationType.Gybrid && 
  // <>
  //   {image}
  //   <span>{salary && Formatter.formatNumber(Number(salary)) + ' ' + TranslateCurrency(currency) + ' + ' } {commission}%</span>
  // </>
  }
 </p>)
}