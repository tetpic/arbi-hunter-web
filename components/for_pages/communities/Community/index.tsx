import ICommunity from 'data/interfaces/ICommunity'
import { useEffect, useState } from 'react'
import CommunityHeader from './CommunityHeader'
import styles from './index.module.scss'
import dynamic from 'next/dynamic'
import { useCommunityContext } from 'context/community_state'
import { useResize } from 'components/hooks/useResize'

const CommunityContent = dynamic(()=> import('./CommunityContent'), {ssr: false})
const CommunityMembers = dynamic(()=> import('./CommunityMembers'), {ssr: false})

interface Props {
  community: ICommunity
  id: number
}

export default function CommunityPage({community, id}: Props) {
  const communityContext = useCommunityContext()
  const {isTabletWidth} = useResize()
  const [loading, setLoad] = useState<boolean>(true)

  const com = communityContext.currentCommunity||community

  useEffect(()=>{
    if(communityContext.currentCommunity) {
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
  <CommunityHeader community={com} />
  {communityContext.currentCommunity &&
    <>
      <CommunityContent/>
      {!isTabletWidth && !loading &&
        <CommunityMembers members={[...communityContext.communityMembers.values()]} loading={loading}/>
      }
    </>
  }
  </div>)
}