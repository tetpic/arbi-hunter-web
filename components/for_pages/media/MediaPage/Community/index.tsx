import styles from './index.module.scss'

import ICommunity from 'data/interfaces/ICommunity'
import { useEffect, useRef, useState } from 'react'
import CommunityHeader from './CommunityHeader'
import dynamic from 'next/dynamic'
import { useCommunityContext } from 'context/community_state'
import { useResize } from 'components/hooks/useResize'
import InfiniteScroll from 'react-infinite-scroll-component'
import Spinner from 'components/ui/Spinner'
import { colors } from 'styles/variables'
import BackTextButton from 'components/ui/BackTextButton'
import { useRouter } from 'next/router'
import { useUserContext } from 'context/user_state'

const CommunityContent = dynamic(()=> import('./CommunityContent'), {ssr: false})
const CommunityMembers = dynamic(()=> import('./CommunityMembers'), {ssr: false})

interface Props {
  community: ICommunity
  id: number
}

export default function CommunityPage({community, id}: Props) {
  const communityContext = useCommunityContext()
  const userContext = useUserContext()
  const {isTabletWidth} = useResize()
  const [loading, setLoad] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>()
  const contentLength = useRef(communityContext.communityNews.size)
  const router = useRouter()
  const com = communityContext.currentCommunity||community

  useEffect(()=>{
    communityContext.getCommunityNews(page)
    .then(res => {
      if(res instanceof Object) {
       setTotal(res.total)        
      }
    })
  }, [page])

  useEffect(()=>{
    if(communityContext.communityNews) {
      contentLength.current = communityContext.communityNews.size
    }
  }, [communityContext.communityNews])

  useEffect(()=>{
    if(communityContext.currentCommunity) {
      communityContext.getCommunityNews(page)
      .then(res => {
        if(res instanceof Object) {
         setTotal(res.total)        
        }
      })
    }
    if(userContext.currentProfile) {
      communityContext.setCommunityMembers(1)
      .then(_=> {
        setLoad(false)
      }
      )
    }
    communityContext.setCurrentCommunity(community)
    return ()=>{communityContext.setCurrentCommunity(null)}
  }, [communityContext.currentCommunity])

  return (<div className={styles.root}> 
  {!isTabletWidth &&
    <BackTextButton className={styles.backButton} onClick={router.back}/>
  }
  <InfiniteScroll 
  next={()=>setPage((p)=> p+1)} 
  hasMore={communityContext.communityNews.size < total} 
  loader={<Spinner size={24} color={colors.yellow}/>} 
  dataLength={contentLength.current}
  height={'100%'}
  >
    <div className={styles.contentWrapper}>
      <CommunityHeader community={com} />
      {communityContext.currentCommunity &&
        <>
          <CommunityContent/>
          {!isTabletWidth && !loading &&
            <CommunityMembers members={[...communityContext.communityMembers.values()]} loading={loading}/>
          }
        </>
      }
  </div>
  </InfiniteScroll>
  </div>
  )
}