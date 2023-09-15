import Button from 'components/ui/Button'
import FavoritesButton from 'components/ui/FavoritesButton'
import UserPic from 'components/ui/UserPic'
import { useVacancyContext } from 'context/vacancy_state'
import { IApplication } from 'data/interfaces/IApplication'
import { IVacancy } from 'data/interfaces/IVacancy'
import Image from 'next/image'
import { CompensationType } from 'types/enums'
import { TranslateCompensationType, TranslateCurrency, TranslatePatternType } from 'utils/enumsTranslations'
import Formatter from 'utils/formatter'
import styles from './index.module.scss'

interface Props {
  vc: IVacancy
  application?: IApplication
  refreshCallback?: Function
}

export default function VacancyItem({vc, application, refreshCallback}: Props) {
  const vacancyContext = useVacancyContext()

  const heartHandler = () => {
    vc.isSavedByCurrentProfile
    ?vacancyContext.removeVacancyFromSaved(vc.id)
    :vacancyContext.saveVacancy(vc.id)
    refreshCallback&&refreshCallback()
  }
  

  return (<div className={styles.root}> 
  <div className={styles.top}>
    <UserPic className={styles.userPic} size={44}/>
    <p className={styles.company}>{vc.company}</p>
    <p className={styles.city}>г. {vc.city?.locName}</p>
    <FavoritesButton className={styles.heartButton} onClick={heartHandler} isActive={vc.isSavedByCurrentProfile}/>
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
   {application &&
    <p className={styles.status}>{TranslatePatternType(application.type)}</p>
   }
  <div className={styles.bottom}>
    <p className={styles.time}>{Formatter.formatToShortYear(vc.updatedAt)}</p>
    {application &&
    <Button className={styles.button}>Перейти в чат</Button>
    ||
    <Button className={styles.button}>Откликнуться</Button>
    }
  </div>
  </div>)
}