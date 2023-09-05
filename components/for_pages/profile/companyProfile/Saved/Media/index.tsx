import CustomScrollbar from 'components/ui/CustomScrollbar'
import Spinner from 'components/ui/Spinner'
import { useArticleContext } from 'context/article_state'
import { useEffect, useState } from 'react'
import styles from './index.module.scss'
import MediaItem from './MediaItem'

interface Props {
}



export default function SavedMedia(props: Props) {

  const mediaContext = useArticleContext()
  const [loaded, setLoaded] = useState<boolean>(false)

  useEffect(()=>{
    mediaContext.setSavedArticles().then(res=> res&&setLoaded(res))
  }, [])

  return (
  <div className={styles.root}> 
    <CustomScrollbar>
     {loaded&&mediaContext.savedArticles && mediaContext.savedArticles.size > 0 &&
      [...mediaContext.savedArticles.values()].map(el=> {
        return <MediaItem media={el}/>
      })
      ||
      loaded&&mediaContext.savedArticles.size === 0&&
      'Нет добавленных медиа'
      ||
      !loaded && <Spinner size={24}/>
     }
    </CustomScrollbar>
  </div>)
}