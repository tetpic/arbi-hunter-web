import styles from './index.module.scss'

import FolderSvg from 'components/svg/FolderSvg'
import PlayButtonSvg from 'components/svg/PlayButtonSvg'
import StarSvg from 'components/svg/StarSvg'
import UserSvg from 'components/svg/UserSvg'
import ICourse from 'data/interfaces/ICourse'
import Image from 'next/image'
import { useRouter } from 'next/router'
import Formatter from 'utils/formatter'
import classNames from 'classnames'
import ImageHelper from 'utils/ImageHelper'
import { Preset } from 'types/enums'
import useTranslation from 'next-translate/useTranslation'

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
  const {t} = useTranslation()

  return (
    <div className={classNames(styles.item, props.className)} onClick={()=> router.push('/courses/' + props.course.id)}>
      <div className={styles.top}>
        <div className={styles.imageWrapper}>
          { 
            (props.image|| props.course.image.source) &&
            <Image 
            unoptimized
            src={props.image||ImageHelper.urlFromFile(props.course.image, Preset.sResize)} 
            alt={'courses image'} 
            width={370}
            height={180}
            />
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
        <p className={styles.lessonsCount}><PlayButtonSvg/>{props.course.stepsCount} {Formatter.pluralize(Number(props.course.stepsCount), t('lesson1'), t('lesson2'), t('lesson3'))}</p>
        <p className={styles.courseName} title={props.course.name}>{props.course.name}</p>
        <p className={styles.price}>{t('from')} {Formatter.formatPrice(props.course.price)}/{t('month')}</p>
        <div className={styles.rating}>
          <span>
            <UserSvg className={styles.userSvg}/>
            {props.course.completedCount} {Formatter.pluralize(props.course.completedCount, t('student1'),  t('student2'),  t('student3'))}
          </span>         
          <span>
            <StarSvg className={styles.starSvg}/>
            {props.course?.rating || '0.0'} {t('outOf')} 5 
          </span>       
        </div>
      </div>
    </div>
    )
}