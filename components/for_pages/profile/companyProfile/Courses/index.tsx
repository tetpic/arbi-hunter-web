import styles from './index.module.scss'

import FolderSvg from 'components/svg/FolderSvg'
import PlayButtonSvg from 'components/svg/PlayButtonSvg'
import StarSvg from 'components/svg/StarSvg'
import UserSvg from 'components/svg/UserSvg'
import FavoritesButton from 'components/ui/FavoritesButton'
import Image from 'next/image'
import Scrollbars from 'react-custom-scrollbars-2'

interface Props {
}

interface ItemProps {
  image?: string
}


function Item(props: ItemProps) {
  return (
  <div className={styles.item}>
    <div className={styles.top}>
      <div className={styles.imageWrapper}>
        { 
          props.image &&<Image src={props.image} alt={'courses image'}/>
          ||
          <FolderSvg/>
        }
      </div>
      <p className={styles.badge}>Разработка</p>
      <FavoritesButton className={styles.heartButton}/>
    </div>
    <div className={styles.bottom}>
      <p className={styles.lessonsCount}><PlayButtonSvg/>10 уроков</p>
      <p className={styles.courseName}>Веб-дизайн начальный и средний уровень</p>
      <p className={styles.price}>от 3 589 ₽/месяц</p>
      <p className={styles.rating}><span><UserSvg className={styles.userSvg}/>1560 учеников</span> <span><StarSvg className={styles.starSvg}/>4,9 из 5 </span></p>
    </div>

  </div>
  )
}

export default function SavedCourses(props: Props) {

  return (<div className={styles.root}> 
  <Scrollbars style={{height: '100%'}}  autoHide universal>
    <div className={styles.wrapper}>
      <Item/>
      <Item/>
      <Item/>
      <Item/>
    </div>
  </Scrollbars>

  </div>)
}