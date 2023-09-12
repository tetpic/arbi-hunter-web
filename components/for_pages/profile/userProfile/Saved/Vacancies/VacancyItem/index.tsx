import Button from 'components/ui/Button'
import FavoritesButton from 'components/ui/FavoritesButton'
import UserPic from 'components/ui/UserPic'
import { useVacancyContext } from 'context/vacancy_state'
import { IVacancy } from 'data/interfaces/IVacancy'
import Image from 'next/image'
import { CompensationType } from 'types/enums'
import { TranslateCompensationType, TranslateCurrency } from 'utils/enumsTranslations'
import Formatter from 'utils/formatter'
import styles from './index.module.scss'

interface Props {
  vc: IVacancy
}

export default function VacancyItem({vc}: Props) {
  const vacancyContext = useVacancyContext()

  const removeFromSaved = () => {
    vacancyContext.removeVacancyFromSaved(vc.id)
  }
  

  return (<div className={styles.root}> 
  <div className={styles.top}>
    <UserPic className={styles.userPic} size={44}/>
    <p className={styles.company}>{vc.company}</p>
    <p className={styles.city}>г. {vc.city.locName}</p>
    <FavoritesButton className={styles.heartButton} onClick={removeFromSaved} isActive={vc.isSavedByCurrentProfile}/>
    {/* <Button className={styles.heartButton} onClick={removeFromSaved}><HeartSvg /></Button> */}
  </div>
  <p className={styles.vcName}>{vc.name}</p>
  <p className={styles.salary}><Image src={'/icons/money.png'} width={24} height={24} alt={'money icon'}/> 
    {
    vc.compensation === CompensationType.Salary&&<span>от {vc.salary} {TranslateCurrency(vc.currency)}</span>
    ||
    vc.compensation === CompensationType.Piecework && <span>{TranslateCompensationType(vc.compensation)} ({TranslateCurrency(vc.currency)})</span>
    ||
    vc.compensation === CompensationType.Commission && <span>{vc.commission}% ({TranslateCurrency(vc.currency)})</span>
    ||
    vc.compensation === CompensationType.Contract &&  <span>{TranslateCompensationType(vc.compensation)}</span>
    ||
    vc.compensation === CompensationType.Gybrid && <span>{Formatter.formatNumber(vc.salary)} {TranslateCurrency(vc.currency)} + {vc.commission}%</span>
   }
   </p>
  <div className={styles.bottom}>
    <p className={styles.time}>{Formatter.formatToShortYear(vc.updatedAt)}</p>
    <Button className={styles.button}>Откликнуться</Button>
  </div>
  </div>)
}