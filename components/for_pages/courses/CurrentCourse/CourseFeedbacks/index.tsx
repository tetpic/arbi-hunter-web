import StarSvg from 'components/svg/StarSvg'
import UserPic from 'components/ui/UserPic'
import { useCoursesContext } from 'context/courses_state'
import { useEffect, useState } from 'react'
import styles from './index.module.scss'
import P from '@/components/ui/P'

interface Props {
  id: number
}

export default function CourseFeedbacks(props: Props) {

  const coursesContext = useCoursesContext()
  const [page, setPage] = useState(1)
  const limit = 10

  const getMarks = (n: number): boolean[] => {
    let result: boolean[] = []
    for(let i = 0; i < 5; i++) {
      result.push(i<n)
    }
    return result
  }

  useEffect(()=>{
    if(coursesContext.feedBacks.length === 0) {
      coursesContext.setFeedbacks(props.id, page, limit)
    }
    coursesContext.getCourseFeedbackStats(props.id)
  }, [])

  return (<div className={styles.root}> 
  {coursesContext.feedBacks.length > 0 &&
    coursesContext.feedBacks.map(el => {
      return  (
        <div className={styles.feedback} key={el.id}>
          <UserPic className={styles.userPic} size={48}/>
          <p className={styles.name}>{el.profile.firstName} {el.profile.lastName}</p>
          <p className={styles.stats}>{getMarks(el.mark).map((el, index)=> <StarSvg key={index} className={el&&styles.activeStar} />)}</p>
          {el.content&&
            <p className={styles.content}>{el.content}</p>
          }
        </div>
        ) 
    })
    ||
    <P useThemeColor className={'empty'}>Вы можете оставить отзыв о курсе первым</P>
  }

  </div>)
}