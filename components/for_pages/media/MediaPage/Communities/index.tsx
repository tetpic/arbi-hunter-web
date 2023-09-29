import Spinner from 'components/ui/Spinner'
import { useMediaContext } from 'context/media_state'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { colors } from 'styles/variables'
import CommunityItem from './CommunityItem'
import styles from './index.module.scss'


export default function MediaCommunities() {
  const mediaContext = useMediaContext()
  const [page, setPage] = useState<number>(1)
  const [loaded, setIsLoaded] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)

  useEffect(()=>{
    if(mediaContext.communities.size<total||mediaContext.communities.size === 0) {
      mediaContext.setCommunities(page).then(res=> {
        if(typeof res === 'object') {
          setIsLoaded(true) 
          setTotal(res.total)
        }
      })
    }
    else {
      setIsLoaded(true) 
    }
  }, [page])

  return (
    <div className={styles.root}> 
      <InfiniteScroll
      height={'100%'}
      next={()=>setPage(p => p+1)}
      hasMore={mediaContext.communities.size < total}
      loader={<Spinner size={24} color={colors.yellow} />}  
      dataLength={mediaContext.communities.size}  
      >
        <div className={styles.infinite}>
          {(loaded && mediaContext.communities.size > 0) &&
            [...mediaContext.communities.values()].map(com => {
              return <CommunityItem community={com}/>
            })
            ||
            !loaded &&
            <Spinner size={34} color={colors.yellow}/>
            ||
            loaded &&
            <p className={'empty'}>Нет загруженных сообществ</p>
          }
        </div>
      </InfiniteScroll>
    </div>)
}