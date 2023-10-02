import Button from 'components/ui/Button'
import Spinner from 'components/ui/Spinner'
import { useCommunityContext } from 'context/community_state'
import { useAppContext } from 'context/state'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { colors } from 'styles/variables'
import { ModalType } from 'types/enums'
import CommunityItem from './CommunityItem'
import styles from './index.module.scss'


export default function MediaCommunities() {
  const communityContext = useCommunityContext()
  const userContext = useUserContext()
  const appContext = useAppContext()
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

  return (<>
    <div className={styles.top}>
      <div className={styles.search}></div>
      {userContext.currentProfile?.profileType === ProfileType.Hirer &&
        <div className={styles.topButtons}>
          <Button className={styles.buttonBlack}>Все сообщества</Button>
          <Button className={styles.buttonBlack}>Мои сообщества</Button>
          <Button onClick={()=> appContext.showModal(ModalType.CreateNewCommunityModal)} className={styles.createButton}>Создать сообщество</Button>
        </div>
      }
    </div>
    <div className={styles.root}> 
        <InfiniteScroll
        height={'100%'}
        next={()=>setPage(p => p+1)}
        hasMore={communityContext.communities.size < total}
        loader={<Spinner size={24} color={colors.yellow} />}  
        dataLength={communityContext.communities.size}  
        >
          <div className={styles.infinite}>
            {(loaded && communityContext.communities.size > 0) &&
              [...communityContext.communities.values()].map(com => {
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
    </div>
  </>)
}