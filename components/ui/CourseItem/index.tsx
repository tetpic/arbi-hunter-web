import styles from './index.module.scss'

import FolderSvg from 'components/svg/FolderSvg'
import PlayButtonSvg from 'components/svg/PlayButtonSvg'
import StarSvg from 'components/svg/StarSvg'
import UserSvg from 'components/svg/UserSvg'
import ICourse from 'data/interfaces/ICourse'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FILES } from 'types/constants'
import Formatter from 'utils/formatter'
import classNames from 'classnames'

interface Props {
  image?: string
  course: ICourse
  className?: string
}


/**
 * @image  string
 * @course ICourse
 * @className  string
 */
export default function CourseItem(props: Props) {
  const router = useRouter()

  return (
    <div className={classNames(styles.item, props.className)} onClick={()=> router.push('/courses/' + props.course.id)}>
      <div className={styles.top}>
        <div className={styles.imageWrapper}>
          { 
            (props.image|| props.course.image.source) &&<Image src={props.image||FILES + props.course.image.source} alt={'courses image'} fill/>
            ||
            <FolderSvg/>
          }
        </div>
        <div className={styles.badges}>
          {props.course.categories.length > 0  &&
          props.course.categories.filter(f=>f.id !== 30).slice(0, 3).map(ctg => {
            return (
              <p key={ctg.id} className={styles.badge}>{ctg.name}</p>
              )
            })
          }
        </div>
        {/* <FavoritesButton className={styles.heartButton}/> */}
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