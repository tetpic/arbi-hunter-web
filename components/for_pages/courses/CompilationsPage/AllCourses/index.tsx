import styles from './index.module.scss'

import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useCoursesContext } from 'context/courses_state'
import Spinner from 'components/ui/Spinner'
import CourseItem from 'components/ui/CourseItem'
import Spacer from 'components/ui/Spacer'
import Formatter from 'utils/formatter'
import { useMediaContext } from 'context/media_state'
import Stories from 'components/ui/Stories'


interface Props {
  started?: boolean
}

export default function AllCourses(props: Props) {

  const [page, setPage] = useState<number>(1)
  const coursesContext = useCoursesContext()
  const mediaContext = useMediaContext()

  useEffect(()=>{
    mediaContext?.setStories&&mediaContext?.setStories(null, 'course')
  }, [])

  useEffect(()=>{
    const data: any = {page}
    props.started&&(data.started = props.started)
    coursesContext.setCourses(data)
  }, [page])

  return (<div className={styles.root}> 
    {mediaContext.stories && mediaContext.stories.size > 0 &&
      <>
      <p className={styles.title}>Истории</p>
      <Stories stories={[...mediaContext.stories?.values()]}/>
      </>
    }
    <p className={styles.found}>Найдено {props.started?coursesContext.startedCoursesTotal:coursesContext.coursesTotal} {Formatter.pluralize(props.started?coursesContext.startedCoursesTotal:coursesContext.coursesTotal, 'курс', 'курса', 'курсов')}</p>
    <InfiniteScroll
    next={()=>setPage(p => p+1)}
    hasMore={props.started
      ?(coursesContext.startedCourses.size < coursesContext.startedCoursesTotal)
      :(coursesContext.courses.size < coursesContext.coursesTotal)}
    loader={<Spinner size={24}/>}  
    scrollableTarget={'scrollable'}
    dataLength={props.started?coursesContext.startedCourses.size:coursesContext.courses.size}  
    >
      <div className={styles.coursesWrapper}>
        {(props.started?[...coursesContext.startedCourses.values()]:[...coursesContext.courses.values()]).map(el=> {
          return <CourseItem key={el.id} className={styles.course} course={el}/>
        })}
      </div>
      <Spacer basis={24}/>
    </InfiniteScroll>
  </div>)
}