import Image from 'next/image'
import CourseItem from 'components/ui/CourseItem'
import ICourse from 'data/interfaces/ICourse'
import { FILES } from 'types/constants'
import PlayButtonSvg from 'components/svg/PlayButtonSvg'
import Formatter from 'utils/formatter'
import UserSvg from 'components/svg/UserSvg'
import StarSvg from 'components/svg/StarSvg'
import { useResize } from 'components/hooks/useResize'
import { useRouter } from 'next/router'
import styles from './index.module.scss'


interface Props {
  title: string
  courses: ICourse[]
}

function BigCourseItem (props: {courseItem: ICourse}) {
  const firstItem = props.courseItem
  const router = useRouter()

  return (
    <div className={styles.left} onClick={()=>router.push(`/courses/${firstItem.id}`)}>
      <div className={styles.imageWrapper}>
        {firstItem.image &&
          <Image 
          src={FILES+ firstItem.image.source} 
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
        <p className={styles.lessonsCount}><PlayButtonSvg/>{firstItem.stepsCount} {Formatter.pluralize(Number(firstItem.stepsCount), 'урок', 'урока', 'уроков')}</p>
        <p className={styles.courseName} title={firstItem.name}>{firstItem.name}</p>
        <p className={styles.price}>от {Formatter.formatPrice(firstItem.price)}/месяц</p>
        <div className={styles.rating}>
          <span>
            <UserSvg className={styles.userSvg}/>
            {firstItem.completedCount} {Formatter.pluralize(firstItem.completedCount, 'ученик', 'ученика', 'учеников')}
          </span>         
          <span>
            <StarSvg className={styles.starSvg}/>
            {firstItem?.rating || '0.0'} из 5 
          </span>       
        </div>
      </div>
    </div>
  )

}

export default function CoursesBlock(props: Props) {
  const {isTabletWidth} = useResize()

  const firstItem = props.courses[0]

  return (<div> <p className={styles.coursesTitle}>{props.title} <Image src={'/icons/diamond.png'} alt={'diamond icon'} width={32} height={34}/></p>
  <div className={styles.coursesWrapper}>
    {isTabletWidth &&
      <CourseItem course={firstItem} />
      ||
      <BigCourseItem courseItem={firstItem} />
    }
    
    {/* <div className={styles.right}> */}
      {props.courses.length > 0 &&
        props.courses.slice(1, 5).map(el => {
          return <CourseItem className={styles.defaultItem} course={el} key={el.id}  />
        })
      }
    {/* </div> */}
  </div>
  </div>
  )
}