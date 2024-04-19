import styles from './index.module.scss'

import { useEffect, useState } from 'react'
import CoursesRepository from 'data/repositories/CoursesRepository'
import { Languages } from 'types/enums'
import ICourse from 'data/interfaces/ICourse'
import InfiniteScroll from 'react-infinite-scroll-component'
import Spinner from 'components/ui/Spinner'
import CourseItem from 'components/ui/CourseItem'
import Spacer from 'components/ui/Spacer'
import Formatter from 'utils/formatter'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  categoryId: number
}

export default function CoursesByCategory(props: Props) {
  const {t} = useTranslation()
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<string>('0')
  const [courses, setCourses] = useState<Map<number, ICourse>>(new Map)

  const init = () => {
    CoursesRepository.getCourses({page, categories: [props.categoryId]}, Languages.ru)  
    .then(res=> {
      setTotal(res.total.toString())
      setCourses(state=> {
        res.data.forEach(c => {
          state.set(c.id, c)
        })
        return state
      })
    })
  }

  useEffect(()=>{
    init()   
  }, [page])

  useEffect(()=>{
    setTotal(null)
    setCourses(new Map)
    setPage(1)
    setTimeout(()=> {
      init()
    }, 20)
  }, [props.categoryId])


  return (
    <div className={styles.root}> 
      {total &&
      <p className={styles.found}>{Formatter.pluralize(Number(total), t('found1'), t('found2'), t('found2'))} {total} {Formatter.pluralize(Number(total), t('course1'), t('course2'), t('course3'))}</p>
      ||
      <Spinner size={24}/>
      }

      <InfiniteScroll
      next={()=>setPage(p => p+1)}
      hasMore={courses.size < Number(total)}
      loader={<Spinner size={24}/>}  
      scrollableTarget={'scrollable'}
      dataLength={courses.size}  
      >
        <div className={styles.coursesWrapper}>
          {[...courses.values()].map(el=> {
            return <CourseItem key={el.id} className={styles.course} course={el}/>
          })}
        </div>
        <Spacer basis={24}/>
      </InfiniteScroll>
    </div>
  )
}