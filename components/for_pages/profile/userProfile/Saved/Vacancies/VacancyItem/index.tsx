import Button from 'components/ui/Button'
import FavoritesButton from 'components/ui/FavoritesButton'
import SalaryItem from 'components/ui/SalaryItem'
import UserPic from 'components/ui/UserPic'
import { useVacancyContext } from 'context/vacancy_state'
import { IApplication } from 'data/interfaces/IApplication'
import { IVacancy } from 'data/interfaces/IVacancy'
import { TranslatePatternType } from 'utils/enumsTranslations'
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
  
  <SalaryItem vacancy={vc}/>
  
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