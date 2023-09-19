import FolderSvg from 'components/svg/FolderSvg'
import PlayButtonSvg from 'components/svg/PlayButtonSvg'
import StarSvg from 'components/svg/StarSvg'
import UserSvg from 'components/svg/UserSvg'
import ICourse from 'data/interfaces/ICourse'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Formatter from 'utils/formatter'
import FavoritesButton from '../FavoritesButton'
import styles from './index.module.scss'

interface Props {
  image?: string
  course: ICourse
}


export default function CourseItem(props: Props) {
  const router = useRouter()

  const env = process.env.files

  return (
    <div className={styles.item} onClick={()=> router.push('/courses/' + props.course.id)}>
      <div className={styles.top}>
        <div className={styles.imageWrapper}>
          { 
            (props.image|| props.course.image.source) &&<Image src={props.image||env + props.course.image.source} alt={'courses image'} fill/>
            ||
            <FolderSvg/>
          }
        </div>
        <p className={styles.badge}>Разработка</p>
        <FavoritesButton className={styles.heartButton}/>
      </div>
      <div className={styles.bottom}>
        <p className={styles.lessonsCount}><PlayButtonSvg/>{props.course.stepsCount} {Formatter.pluralize(Number(props.course.stepsCount), 'урок', 'урока', 'уроков')}</p>
        <p className={styles.courseName} title={props.course.name}>{props.course.name}</p>
        <p className={styles.price}>от {Formatter.formatPrice(props.course.price)}/месяц</p>
        <div className={styles.rating}>
          <span>
            <UserSvg className={styles.userSvg}/>
            {props.course.completedCount} {Formatter.pluralize(props.course.completedCount, 'ученик', 'ученика', 'учеников')}
          </span>         
          <span>
            <StarSvg className={styles.starSvg}/>
            {props.course?.rating || '0.0'} из 5 
          </span>       
        </div>
      </div>
    </div>
    )
}