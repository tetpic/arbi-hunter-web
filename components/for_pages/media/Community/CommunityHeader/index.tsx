import EditSvg from 'components/svg/EditSvg'
import PhotoCameraSvg from 'components/svg/PhotoCameraSvg'
import UsersSvg from 'components/svg/UsersSvg'
import Button from 'components/ui/Button'
import UserPic from 'components/ui/UserPic'
import { useCommunityContext } from 'context/community_state'
import { useAppContext } from 'context/state'
import { useUserContext } from 'context/user_state'
import ICommunity from 'data/interfaces/ICommunity'
import Image from 'next/image'
import { useState } from 'react'
import { FILES } from 'types/constants'
import { ModalType } from 'types/enums'
import Formatter from 'utils/formatter'
import styles from './index.module.scss'

interface Props {
  community: ICommunity
}

export default function CommunityHeader({community}: Props) {
  
  const communityContext = useCommunityContext()
  const userContext = useUserContext()
  const appContext = useAppContext()
  const [isLoading, setIsLoading] = useState<boolean>()

  const buttonHandler = async () => {
    setIsLoading(true)
    await communityContext.communitySubsription(community.id, community.isSubscribedByCurrentProfile)
    setIsLoading(false)
  }

  const size = 114

  const isAdmin = community.profile?.id === userContext.currentProfile?.id

  const camera = (
    <div className={styles.svgWrapper}  style={{width: size, height: size}}>
      <PhotoCameraSvg/>
    </div>
  )

  return (<div className={styles.root}> 
    <div className={styles.background}>
      {community.image &&
        <Image src={FILES+ community.image.source} alt={community.name + ' background'} fill/>
      }
      {isAdmin &&
        <Button className={styles.editCover} ><EditSvg/> Изменить обложку</Button>
      }
    </div>
    <div className={styles.content}>
      <UserPic 
      className={styles.userPic} 
      image={community.logo&&FILES + community.logo.source} 
      icon={community.profile.id === userContext.currentProfile?.id&&!community.logo&&camera} 
      size={/*props.image?114:80*/ size}
      />
      <p className={styles.name}>{community.name}</p>
      <p className={styles.members}>
        <UsersSvg/>
        {Formatter.formatNumber(Number(community.membersCount))} {Formatter.pluralize(+community.membersCount, 'участник', 'участника', 'участников')}
      </p>
      {
        isAdmin?
        <Button className={styles.editCommunity} onClick={()=>appContext.showModal(ModalType.EditCommunityModal, community)}>Настройки сообщества</Button>
        :
        <Button 
        isProcess={isLoading}
        disabled={isLoading}
        className={styles.button}
        onClick={buttonHandler} 
        >
          {community.isSubscribedByCurrentProfile?'Отписаться':'Подписаться'}
        </Button>
      }
    </div>


  </div>)
}