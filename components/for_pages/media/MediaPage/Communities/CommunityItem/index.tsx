import styles from './index.module.scss'

import UserSvg from 'components/svg/UserSvg'
import Button from 'components/ui/Button'
import UserPic from 'components/ui/UserPic'
import { useCommunityContext } from 'context/community_state'
import ICommunity from 'data/interfaces/ICommunity'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FILES } from 'types/constants'
import Formatter from 'utils/formatter'
import { useResize } from 'components/hooks/useResize'
import CheckSvg from 'components/svg/CheckSvg'
import PlusSvg from 'components/svg/PlusSvg'
import { colors } from 'styles/variables'

interface Props {
  community: ICommunity
}

export default function CommunityItem({community}: Props) {
  const communityContext = useCommunityContext()
  const router = useRouter()
  const [load, setLoad] = useState<boolean>(false)
  const {isTabletWidth} = useResize()

  const onClickHandler = async () => {
    setLoad(true)
    await communityContext.communitySubsription(community.id, community.isSubscribedByCurrentProfile)
    setLoad(false)
  }

  const isAdmin = communityContext.myCommunity?.id === community.id 
  const isSubscribed = community.isSubscribedByCurrentProfile


  return ( <div className={styles.item} onClick={()=>router.push(`/media/community/${community.id}`)}>
    <UserPic  className={styles.userPic} image={community.logo&&FILES + community.logo.source} size={isTabletWidth?42:80} />
    <p className={styles.counter}>
      <UserSvg/>
      {Formatter.formatNumber(Number(community.membersCount))}
    </p>
    {!isAdmin && !isTabletWidth &&
      <Button
      disabled={load}
      isProcess={load}
      onClick={(e)=>{e.stopPropagation(); onClickHandler()}} 
      className={styles.button}
      >
        {
          isSubscribed?'Отписаться':'Подписаться'
        }
      </Button>
      ||
      !isAdmin &&
      <Button 
      className={isSubscribed?styles.buttonGradient:styles.buttonBorderGradient}
      onClick={(e)=>{e.stopPropagation(); onClickHandler()}} 

      >
        {isSubscribed?<CheckSvg color={colors.blue}/>:<PlusSvg/>}
      </Button>
    }
    <p className={styles.name}>{community.name}</p>
  </div>)
}