import DotSvg from 'components/svg/DotSvg'
import Button from 'components/ui/Button'
// import CustomScrollbar from 'components/ui/CustomScrollbar'
import FavoritesButton from 'components/ui/FavoritesButton'
import UserPic from 'components/ui/UserPic'
import { useUserContext } from 'context/user_state'
import { IUser } from 'data/interfaces/IUser'
import { useEffect } from 'react'
import styles from './index.module.scss'

interface Props {
}

interface ItemProps {
  user: IUser
}
//TODO: пробросить данные, создать новый интерфейс для CV, потому что приходит больше данных чем ожидал
function Item(props: ItemProps) {
  return (
    <div className={styles.itemWrapper}>
    <div className={styles.top}>
      <UserPic size={46} className={styles.userPic}/>
      <p className={styles.position}>Product Manager</p>
      <p className={styles.name}>Иван Иванов <DotSvg/> 32 года</p>
     <FavoritesButton className={styles.heartButton}/>
    </div>
    <div className={styles.middle}>
      <p className={styles.title}>Опыт работы</p>
      <p className={styles.data}>3 года 11 месяцев</p>
    </div>
    <div className={styles.middle}>
      <p className={styles.title}>Последнее место работы</p>
      <p className={styles.data}>Заместитель редактора ООО “Тинькоф”</p>
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
      return <Item key={el.id} user={el}/>
    })}
  </div>
  )
}