import ICommunity from 'data/interfaces/ICommunity'
import { useEffect } from 'react'
import CommunityHeader from './CommunityHeader'
import styles from './index.module.scss'
import dynamic from 'next/dynamic'
import { useCommunityContext } from 'context/community_state'

const CommunityContent = dynamic(()=> import('./CommunityContent'), {ssr: false})
const CommunityMembers = dynamic(()=> import('./CommunityMembers'), {ssr: false})

interface Props {
  community: ICommunity
  id: number
}

export default function CommunityPage({community, id}: Props) {
  
  const communityContext = useCommunityContext()

  const com = communityContext.currentCommunity||community

  useEffect(()=>{
    communityContext.setCurrentCommunity(community)
    // return ()=>{communityContext.setCurrentCommunity(null)}
  }, [])

  useEffect(()=>{
    
  }, [communityContext.currentCommunity])
  

  return (<div className={styles.root}> 
  <CommunityHeader community={com} />
  
  {communityContext.currentCommunity &&
  <>
    <CommunityContent/>
    <CommunityMembers/>
  </>
  }


  

  </div>)
}