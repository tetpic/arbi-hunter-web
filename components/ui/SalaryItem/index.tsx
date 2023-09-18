import { IVacancy } from 'data/interfaces/IVacancy'
import Image from 'next/image'
import { CompensationType } from 'types/enums'
import { TranslateCompensationType, TranslateCurrency } from 'utils/enumsTranslations'
import Formatter from 'utils/formatter'
import styles from './index.module.scss'

interface Props {
  vacancy: IVacancy
}

export default function SalaryItem({vacancy}: Props) {

  return (<p className={styles.salary}><Image src={'/icons/money.png'} width={24} height={24} alt={'money icon'}/> 
  {
  vacancy.compensation === CompensationType.Salary&&<span>от {vacancy.salary} {TranslateCurrency(vacancy.currency)}</span>
  ||
  vacancy.compensation === CompensationType.Piecework && <span>{TranslateCompensationType(vacancy.compensation)} ({TranslateCurrency(vacancy.currency)})</span>
  ||
  vacancy.compensation === CompensationType.Commission && <span>{vacancy.commission}% ({TranslateCurrency(vacancy.currency)})</span>
  ||
  vacancy.compensation === CompensationType.Contract &&  <span>{TranslateCompensationType(vacancy.compensation)}</span>
  ||
  vacancy.compensation === CompensationType.Gybrid && <span>{Formatter.formatNumber(vacancy.salary)} {TranslateCurrency(vacancy.currency)} + {vacancy.commission}%</span>
 }
 </p>)
}