import UserSvg from 'components/svg/UserSvg'
import Button from 'components/ui/Button'
import UserPic from 'components/ui/UserPic'
import { useCommunityContext } from 'context/community_state'
import ICommunity from 'data/interfaces/ICommunity'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FILES } from 'types/constants'
import Formatter from 'utils/formatter'
import styles from './index.module.scss'

interface Props {
  community: ICommunity
}

export default function CommunityItem({community}: Props) {
  const communityContext = useCommunityContext()
  const router = useRouter()
  const [load, setLoad] = useState<boolean>(false)

  const onClickHandler = async () => {
    setLoad(true)
    await communityContext.communitySubsription(community.id, community.isSubscribedByCurrentProfile)
    setLoad(false)
  }


  return ( <div className={styles.item} onClick={()=>router.push(`/media/community/${community.id}`)}>
    <UserPic  className={styles.userPic} image={community.logo&&FILES + community.logo.source} size={80} />
    <p className={styles.counter}>
      <UserSvg/>
      {Formatter.formatNumber(Number(community.membersCount))}
    </p>
    <Button
    disabled={load}
    isProcess={load}
    onClick={(e)=>{e.stopPropagation(); onClickHandler()}} 
    className={styles.button}
    >
      {community.isSubscribedByCurrentProfile?'Отписаться':'Подписаться'}
    </Button>
    <p className={styles.name}>{community.name}</p>
  </div>)
}