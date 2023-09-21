import MediaItem from 'components/for_pages/profile/Media/MediaItem'
import { useCoursesContext } from 'context/courses_state'
import { useEffect } from 'react'
import styles from './index.module.scss'

interface Props {
  id: number
}

export default function CourseNews(props: Props) {
  const {coursesNews, setCoursesNews} = useCoursesContext()

  useEffect(()=>{
    setCoursesNews(props.id, 1)
  }, [])

  return (<div className={styles.root}> 
  {coursesNews.length>0 && coursesNews.map((el)=> {
    return <MediaItem media={el} key={el.id}/>
  })
  ||
  <p className={'empty'}>Нет новостей</p>
  }
  </div>)
}