import Spinner from 'components/ui/Spinner'
import { useCommunityContext } from 'context/community_state'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { colors } from 'styles/variables'
import CommunityItem from './CommunityItem'
import styles from './index.module.scss'

const CommunityTopButtons = dynamic(()=> import('./CommunityTopButtons'))

export default function Communities() {
  const communityContext = useCommunityContext()
  const userContext = useUserContext()
  const [page, setPage] = useState<number>(1)
  const [loaded, setIsLoaded] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(0)

  useEffect(()=>{
    if(communityContext.communities.size<total||communityContext.communities.size === 0) {
      communityContext.setCommunities(page).then(res=> {
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

  useEffect(()=>{
    communityContext.setMyCommunity()
    if(communityContext.communities.size > total) {
     communityContext.setCommunities(page).then(res=> {
       if(typeof res === 'object') {
         setIsLoaded(true) 
         setTotal(res.total)
       }
     })
    }
  }, [])

  const isMyCommunityExist = !!communityContext.myCommunity

  return (<>
    {userContext.currentProfile?.profileType === ProfileType.Hirer && !isMyCommunityExist &&
      <div className={styles.top}>
        <div className={styles.search}></div>
          <CommunityTopButtons isMyComunityExist={isMyCommunityExist}/>
      </div>
    }
    <div className={styles.root}> 
        <InfiniteScroll
        height={'100%'}
        next={()=>setPage(p => p+1)}
        hasMore={communityContext.communities.size < total}
        loader={<Spinner size={24} color={colors.yellow} />}  
        dataLength={communityContext.communities.size}  
        >
          <div className={styles.infinite}>
            {communityContext.myCommunity &&
              <CommunityItem community={communityContext.myCommunity}/>
            }
            {(loaded && communityContext.communities.size > 0) &&
              [...communityContext.communities.values()].map(com => {
                return <CommunityItem community={com} key={com.id}/>
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
    </div>
  </>)
}