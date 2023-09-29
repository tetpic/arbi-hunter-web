import HeartSvg from 'components/svg/HeartSvg'
import OpenEyeSvg from 'components/svg/OpenEyeSvg'
import Spinner from 'components/ui/Spinner'
import ThreeDotsButton from 'components/ui/ThreeDotsButton'
import UserPic from 'components/ui/UserPic'
import { useMediaContext } from 'context/media_state'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { colors } from 'styles/variables'
import { FILES } from 'types/constants'
import Formatter from 'utils/formatter'
import styles from './index.module.scss'

interface Props {
}

export default function CommunityContent(props: Props) {
  const mediaContext = useMediaContext()
  const [loading, setLoading] = useState()
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>()

  useEffect(()=>{
    mediaContext.getCommunityNews(page)
    .then(res => {
      if(res instanceof Object) {
       setTotal(res.total)        
      }
    })
  }, [page])
  

  return (
  <div className={styles.root}> 
    <InfiniteScroll 
    next={()=>setPage((p)=> p+1)} 
    hasMore={mediaContext.communityNews.size < total} 
    loader={<Spinner size={24} color={colors.yellow}/>} 
    dataLength={mediaContext.communityNews.size}
    height={'100%'}
    >
      <div className={styles.infinite}>
        {mediaContext.communityNews.size > 0 && !loading &&
        [...mediaContext.communityNews.values()].map(news=> {
          return (
              <div className={styles.item}>
                <div className={styles.top}>
                  <UserPic className={styles.userPic} image={mediaContext.currentCommunity.logo&&FILES + mediaContext.currentCommunity.logo.source} size={48}/>
                  <p className={styles.communityName}>{mediaContext.currentCommunity.name}</p>
                  <p className={styles.published}>{Formatter.formatDateRelative(news.updatedAt)}</p>
                  <ThreeDotsButton className={styles.button}/>
                </div>
                <p className={styles.name}>{news.name}</p>
                {news.image &&
                <div className={styles.imageWrapper}>
                  <Image className={styles.image} src={FILES + news.image.source} alt={news.name + ' image'} width={727} height={277}/>
                </div>
                }
                <div className={styles.bottom}>
                  <p className={styles.likes}><HeartSvg/> {news.likesCount}</p>
                  <p className={styles.views}><OpenEyeSvg/> {news.totalViews}</p>
                </div>
            </div>
          )
        })
        ||
        loading && <Spinner size={24} color={colors.yellow}/>
        ||
        <p className={'empty'}>Нет новостей</p>
        }
      </div>
    </InfiniteScroll>
  </div>
  )
}