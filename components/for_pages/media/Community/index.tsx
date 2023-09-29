import { useMediaContext } from 'context/media_state'
import ICommunity from 'data/interfaces/ICommunity'
import { useEffect } from 'react'
import CommunityHeader from './CommunityHeader'
import styles from './index.module.scss'
import dynamic from 'next/dynamic'

const CommunityContent = dynamic(()=> import('./CommunityContent'), {ssr: false})
const CommunityMembers = dynamic(()=> import('./CommunityMembers'), {ssr: false})

interface Props {
  community: ICommunity
  id: number
}

export default function CommunityPage({community, id}: Props) {
  
  const mediaContext = useMediaContext()

  const com = mediaContext.currentCommunity||community

  useEffect(()=>{
    mediaContext.setCurrentCommunity(community)
    return ()=>{mediaContext.setCurrentCommunity(null)}
  }, [])

  useEffect(()=>{
    
  }, [mediaContext.currentCommunity])
  

  return (<div className={styles.root}> 
  <CommunityHeader 
  image={com.image} 
  logo={com.logo} 
  id={id} 
  name={com.name} 
  members={Number(com.membersCount)} 
  subscribed={com.isSubscribedByCurrentProfile}/>
  
  {mediaContext.currentCommunity &&
  <>
    <CommunityContent/>
    <CommunityMembers/>
  </>
  }


  

  </div>)
}