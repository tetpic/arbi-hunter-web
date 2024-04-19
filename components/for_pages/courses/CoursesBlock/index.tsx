import styles from './index.module.scss'

import Image from 'next/image'
import CourseItem from 'components/ui/CourseItem'
import ICourse from 'data/interfaces/ICourse'
import PlayButtonSvg from 'components/svg/PlayButtonSvg'
import Formatter from 'utils/formatter'
import UserSvg from 'components/svg/UserSvg'
import StarSvg from 'components/svg/StarSvg'
import { useResize } from 'components/hooks/useResize'
import { useRouter } from 'next/router'
import { Swiper, SwiperSlide } from 'swiper/react'
import ImageHelper from 'utils/ImageHelper'
import { Preset } from 'types/enums'
import useTranslation from 'next-translate/useTranslation'


interface Props {
  courses: ICourse[]
}

function BigCourseItem (props: {courseItem: ICourse}) {
  const {t} = useTranslation()
  const firstItem = props.courseItem
  const router = useRouter()

  return (
    <div className={styles.left} onClick={()=>router.push(`/courses/${firstItem.id}`)}>
      <div className={styles.imageWrapper}>
        {firstItem?.image &&
          <Image 
          unoptimized
          src={ImageHelper.urlFromFile(firstItem.image, Preset.mdResize)} 
          alt={firstItem.name + ' image'}
          width={372}
          height={766}
          style={{objectFit: 'cover', width: '100%', height: '100%'}}
          />
        }
      </div>
      <div className={styles.badges}>
        {firstItem.categories.length > 0  &&
          firstItem.categories.filter(f=>f.id !== 30).map(ctg => {
          return (
            <p key={ctg.id} className={styles.badge}>{ctg.name}</p>
            )
          })
        }
      </div>
      <div className={styles.bottom}>
        <p className={styles.lessonsCount}><PlayButtonSvg/>{firstItem.stepsCount} {Formatter.pluralize(Number(firstItem.stepsCount), t('lesson1'), t('lesson2'), t('lesson3'))}</p>
        <p className={styles.courseName} title={firstItem.name}>{firstItem.name}</p>
        <p className={styles.shortDescription}>{firstItem.shortDescription}</p>
        <p className={styles.price}>{t('from')} {Formatter.formatPrice(firstItem.price)}/{t('month')}</p>
        <div className={styles.rating}>
          <span>
            <UserSvg className={styles.userSvg}/>
            {firstItem.completedCount} {Formatter.pluralize(firstItem.completedCount, t('student1'), t('student2'), t('student3'))}
          </span>         
          <span>
            <StarSvg className={styles.starSvg}/>
            {firstItem?.rating || '0.0'} {t('outOf')} 5 
          </span>       
        </div>
      </div>
    </div>
  )

}

export default function CoursesBlock(props: Props) {
  const {isTabletWidth} = useResize()

  const firstItem = props.courses[0]

  return (
    <div className={styles.coursesWrapper}>
      {!isTabletWidth && <BigCourseItem courseItem={firstItem} />}
      {!isTabletWidth&&props.courses.length > 0 &&
        props.courses.slice(1, 5).map(el => {
          return <CourseItem className={styles.defaultItem} course={el} key={el.id}  />
        })
      }
      {isTabletWidth &&
        <Swiper
        className={styles.swiper}
        spaceBetween={16}
        >
          {props.courses.map(el => {
            return (
              <SwiperSlide>
                <CourseItem className={styles.defaultItem} course={el} key={el.id}/>
              </SwiperSlide>
            )
          })}
        </Swiper>
      }
    </div>
  )
}