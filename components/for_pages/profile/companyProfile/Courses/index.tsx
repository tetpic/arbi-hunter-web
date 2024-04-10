import P from '@/components/ui/P'
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
    courseCountext.setCourses({savedByCurrentProfile: true, page})
  }, [page])

  return (<div className={styles.root}> 
    {courseCountext.courseLoading && <Spinner size={24}/>}
    {!courseCountext.courseLoading && courseCountext.courses.size === 0 &&
    <P useThemeColor className='empty'>Нет сохраненных курсов</P>
    }
    <InfiniteScroll
    next={()=>setPage(p => p+1)}
    hasMore={courseCountext?.courses?.size < courseCountext.coursesTotal}
    loader={<Spinner size={24}/>}  
    scrollableTarget={'scrollable'}
    dataLength={courseCountext?.courses?.size}  
    >
      <div className={styles.wrapper}>
        {courseCountext?.courses?.size > 0 &&
        [...courseCountext.courses.values()].map(course =>{
          return (<CourseItem className={styles.item} course={course}/>)
        })
        }
      </div>
    </InfiniteScroll>
  </div>)
}