import styles from './index.module.scss'

import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useCoursesContext } from 'context/courses_state'
import Spinner from 'components/ui/Spinner'
import CourseItem from 'components/ui/CourseItem'
import Spacer from 'components/ui/Spacer'
import Formatter from 'utils/formatter'


interface Props {
  started?: boolean
}

export default function AllCourses(props: Props) {

  const [page, setPage] = useState<number>(1)
  const coursesContext = useCoursesContext()


  useEffect(()=>{
    const data: any = {page}
    props.started&&(data.started = props.started)
    coursesContext.setCourses(data)
  }, [page])



  return (<div className={styles.root}> 
    {(props.started?coursesContext.startedCourses.size > 0:coursesContext.courses.size > 0)&&
      <p className={styles.found}>Найдено {props.started?coursesContext.startedCoursesTotal:coursesContext.coursesTotal} {Formatter.pluralize(props.started?coursesContext.startedCoursesTotal:coursesContext.coursesTotal, 'курс', 'курса', 'курсов')}</p>
    }
    {coursesContext.courseLoading && (props.started?coursesContext.startedCourses.size ===0:coursesContext.courses.size ===0) &&
      <Spinner className={styles.spinner} size={24}/>
    }
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