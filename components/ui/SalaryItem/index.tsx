import { IVacancy } from 'data/interfaces/IVacancy'
import Image from 'next/image'
import { CompensationType } from 'types/enums'
import { TranslateCompensationType, TranslateCurrency } from 'utils/enumsTranslations'
import Formatter from 'utils/formatter'
import styles from './index.module.scss'
import { ICV } from 'data/interfaces/ICV'

interface Props {
  vacancy?: IVacancy
  cv?: ICV
}

export default function SalaryItem({vacancy, cv}: Props) {

  return (<p className={styles.salary}><Image src={'/icons/money.png'} width={24} height={24} alt={'money icon'}/> 
  {
  (vacancy?.compensation === CompensationType.Salary||cv?.compensation === CompensationType.Salary) && <span>от {vacancy?.salary||cv?.salary} {TranslateCurrency(vacancy?.currency||cv?.currency)}</span>
  ||
  (vacancy?.compensation === CompensationType.Piecework||cv?.compensation === CompensationType.Piecework) && <span>{TranslateCompensationType(vacancy?.compensation||cv.compensation)} ({TranslateCurrency(vacancy?.currency||cv?.currency)})</span>
  ||
  (vacancy?.compensation === CompensationType.Commission||cv?.compensation === CompensationType.Commission) && <span>{vacancy?.commission||cv?.commission}% ({TranslateCurrency(vacancy?.currency||cv?.currency)})</span>
  ||
  (vacancy?.compensation === CompensationType.Contract||cv?.compensation === CompensationType.Contract) &&  <span>{TranslateCompensationType(vacancy?.compensation||cv?.compensation)}</span>
  ||
  (vacancy?.compensation === CompensationType.Gybrid||cv?.compensation === CompensationType.Gybrid) && <span>{Formatter.formatNumber(vacancy?.salary||cv?.salary)} {TranslateCurrency(vacancy?.currency||cv?.currency)} + {vacancy?.commission||cv?.commission}%</span>
 }
 </p>)
}