import DotSvg from 'components/svg/DotSvg'
import { ICV } from 'data/interfaces/ICV'
import Formatter from 'utils/formatter'
import Button from '../Button'
import FavoritesButton from '../FavoritesButton'
import UserPic from '../UserPic'
import styles from './index.module.scss'

interface ItemProps {
  cv: ICV
}

export default function CvCard({cv}: ItemProps) {

  const experience = cv.experienceInfo?Formatter.fullTimeLine(cv.experienceInfo?.map(el=>[el.fromDate, el.toDate])):'Без опыта'

  return (
    <div className={styles.itemWrapper}>
    <div className={styles.top}>
      <UserPic size={46} className={styles.userPic}/>
      <p className={styles.position}>{cv.position||'Должность не указана'}</p>
      <p className={styles.name}>{cv.firstName} {cv.lastName} <DotSvg/> {cv.age} {Formatter.pluralize(cv.age, 'год', 'года', 'лет')}</p>
      <FavoritesButton className={styles.heartButton}/>
    </div>
    <div className={styles.middle}>
      <p className={styles.title}>Опыт работы</p>
      <p className={styles.data}>{experience}</p>
    </div>
    {cv.lastExperienceInfo &&
    <div className={styles.middle}>
      <p className={styles.title}>Последнее место работы</p>
      <p className={styles.data}>{cv.lastExperienceInfo?.description&&cv.lastExperienceInfo?.description} {cv.lastExperienceInfo?.company&&('"' + cv.lastExperienceInfo?.company + '"')}</p>
    </div>
    }
    <Button className={styles.button} >Пригласить</Button>
  </div>
  )
}