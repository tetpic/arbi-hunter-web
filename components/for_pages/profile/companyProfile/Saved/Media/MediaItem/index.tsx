import HeartSvg from 'components/svg/HeartSvg'
import OpenEyeSvg from 'components/svg/OpenEyeSvg'
import { IArticle } from 'data/interfaces/IArticle'
import styles from './index.module.scss'
import Image from 'next/image'
import ThreeDotsSvg from 'components/svg/ThreeDotsSvg'
import UserPic from 'components/ui/UserPic'
import { env } from 'process'


interface Props {
  media: IArticle
}

export default function MediaItem(props: Props) {

 
  

  return (  <div className={styles.item}>
    <div className={styles.head}>
      <UserPic size={48} className={styles.userPic} />
      <p className={styles.name}>The North Face</p>
      <p className={styles.date}>Сегодня, 22:52</p>
      <ThreeDotsSvg className={styles.dots}/>
    </div>
    <p className={styles.description}>
      Уже скоро! Яркий зимний трейл в потрясающих декорациях арт-парка Николо-Ленивец: Wild Trail Вас ждут интересные и техничные дистанции от 10 до 42 км, фан забеги, встречи с друзьями.
    </p>
    <div className={styles.images}>

    
    </div>
    <div className={styles.stats}>
      <p ><HeartSvg size={24}/> 136</p>
      <p ><OpenEyeSvg/> 10.5K</p>
    </div>
  </div>)
}