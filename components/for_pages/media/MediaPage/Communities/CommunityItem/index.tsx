import styles from './index.module.scss'

import UserSvg from 'components/svg/UserSvg'
import Button from 'components/ui/Button'
import UserPic from 'components/ui/UserPic'
import { useCommunityContext } from 'context/community_state'
import ICommunity from 'data/interfaces/ICommunity'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Formatter from 'utils/formatter'
import CheckSvg from 'components/svg/CheckSvg'
import PlusSvg from 'components/svg/PlusSvg'
import { colors } from 'styles/variables'
import ImageHelper from 'utils/ImageHelper'
import { AppTheme, Preset } from 'types/enums'
import useTranslation from 'next-translate/useTranslation'
import P from '@/components/ui/P'
import { useAppContext } from 'context/state'

interface Props {
  community: ICommunity
}

export default function CommunityItem({community}: Props) {
  const communityContext = useCommunityContext()
  const {t} = useTranslation()
  const router = useRouter()
  const [load, setLoad] = useState<boolean>(false)
  const appContext = useAppContext()

  const {isTabletWidth} = appContext.size
  const isLightTheme = appContext.theme === AppTheme.Light

  const onClickHandler = async () => {
    setLoad(true)
    await communityContext.communitySubsription(community.id, community.isSubscribedByCurrentProfile)
    setLoad(false)
  }

  const isAdmin = communityContext.myCommunity?.id === community.id 
  const isSubscribed = community.isSubscribedByCurrentProfile


  return ( <div className={styles.item} onClick={()=>router.push(`/media/community/${community.id}`)}>
    <UserPic  className={styles.userPic} image={community.logo&&ImageHelper.urlFromFile(community.logo, Preset.xsCrop)} size={isTabletWidth?42:80} />
    <P className={styles.counter} useThemeColor>
      <UserSvg color={isLightTheme&&colors.black}/>
      {Formatter.formatNumber(Number(community.membersCount))}
    </P>
    {!isAdmin && !isTabletWidth &&
      <Button
      disabled={load}
      isProcess={load}
      onClick={(e)=>{e.stopPropagation(); onClickHandler()}} 
      styleType={['black', 'borderGradient']}
      altStyleType={['white']}
      >
        {
          isSubscribed?t('community_unsubscribe'):t('community_subscribe')
        }
      </Button>
      ||
      !isAdmin &&
      <Button 
      styleType={isSubscribed?['gradient', 'icon']:['black', 'borderGradient','icon']}
      altStyleType={isSubscribed?['gradient','icon']:['white','icon', 'invertSvg']}
      // className={isSubscribed?styles.buttonGradient:styles.buttonBorderGradient}
      onClick={(e)=>{e.stopPropagation(); onClickHandler()}} 

      >
        {isSubscribed?<CheckSvg color={colors.white}/>:<PlusSvg/>}
      </Button>
    }
    <P styleType={['medium', 'w500']} useThemeColor className={styles.name}>{community.name}</P>
  </div>)
}