import MediaItem from 'components/for_pages/profile/Media/MediaItem'
import { useCoursesContext } from 'context/courses_state'
import { useEffect } from 'react'
import styles from './index.module.scss'
import { MediaWrapper } from 'context/media_state'

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
    return <MediaWrapper><MediaItem type={el.articleType} showContent  media={el} key={el.id}/></MediaWrapper>
  })
  ||
  <p className={'empty'}>Нет новостей</p>
  }
  </div>)
}