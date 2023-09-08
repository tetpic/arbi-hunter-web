import DotSvg from 'components/svg/DotSvg'
import Button from 'components/ui/Button'
import FavoritesButton from 'components/ui/FavoritesButton'
import UserPic from 'components/ui/UserPic'
import { useUserContext } from 'context/user_state'
import { ICV } from 'data/interfaces/ICV'
import { useEffect } from 'react'
import Formatter from 'utils/formatter'
import styles from './index.module.scss'

interface Props {
}

interface ItemProps {
  cv: ICV
}

function Item({cv}: ItemProps) {

  const experience = Formatter.fullTimeLine(cv.experienceInfo.map(el=>[el.fromDate, el.toDate]))

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
    <div className={styles.middle}>
      <p className={styles.title}>Последнее место работы</p>
      <p className={styles.data}>{cv.lastExperienceInfo.description} &quot;{cv.lastExperienceInfo.company}&quot;</p>
    </div>
    <Button className={styles.button} >Пригласить</Button>
  </div>
  )
}

export default function SavedCVs(props: Props) {

  const userContext = useUserContext()

  useEffect(()=>{
    userContext.setSavedCvs()
  }, [])

  return (
    <div className={styles.root}> 
    {userContext.savedCvs&&userContext.savedCvs.map(el => {
      return <Item key={el.id} cv={el}/>
    })}
  </div>
  )
}