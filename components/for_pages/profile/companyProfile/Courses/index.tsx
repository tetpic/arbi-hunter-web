import styles from './index.module.scss'

import CourseItem from 'components/ui/CourseItem'
import Spinner from 'components/ui/Spinner'
import { useCoursesContext } from 'context/courses_state'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

interface Props {
}



export default function SavedCourses(props: Props) {
  const [page, setPage] = useState<number>(1)
  const courseCountext = useCoursesContext()

  useEffect(()=>{
    courseCountext.setCourses({started: true, page})
  }, [page])

  return (<div className={styles.root}> 
    <InfiniteScroll
    next={()=>setPage(p => p+1)}
    hasMore={courseCountext?.startedCourses?.size < courseCountext.startedCoursesTotal}
    loader={<Spinner size={24}/>}  
    scrollableTarget={'scrollable'}
    dataLength={courseCountext?.startedCourses?.size}  
    >
      <div className={styles.wrapper}>
        {courseCountext?.startedCourses?.size > 0 &&
        [...courseCountext.startedCourses.values()].map(course =>{
          return (<CourseItem className={styles.item} course={course}/>)
        })
        }
      </div>
    </InfiniteScroll>
  </div>)
}