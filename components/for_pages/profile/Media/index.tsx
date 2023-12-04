import Spinner from 'components/ui/Spinner'
import { useMediaContext } from 'context/media_state'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from './index.module.scss'
import MediaItem from './MediaItem'



export default function SavedMedia() {

  const mediaContext = useMediaContext()
  const [loaded, setLoaded] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  useEffect(()=>{
    mediaContext.setSavedArticles(page).then(res=> {
      if(typeof res === 'object') {
        setLoaded(true) 
        setTotal(res.total)
      }
    })
  }, [page])

  return (
  <div className={styles.root}> 
    <InfiniteScroll 
    className={styles.infinite}
    next={()=>setPage(p => p+1)} 
    hasMore={mediaContext.savedArticles.size < total}    
    loader={<Spinner size={24}/>}
    scrollableTarget='scrollable'
    dataLength={0}>
      {loaded&&mediaContext?.savedArticles && mediaContext?.savedArticles?.size > 0 &&
        [...mediaContext?.savedArticles?.values()].map(el=> {
          return <MediaItem media={el} key={el.id} type={el.articleType}/>
        })
        ||
        loaded&&mediaContext.savedArticles.size === 0&&
        <p className={'empty'}>Нет добавленных медиа</p>
     }
    </InfiniteScroll>
  </div>)
}