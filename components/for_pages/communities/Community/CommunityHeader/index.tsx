import { useResize } from 'components/hooks/useResize'
import EditSvg from 'components/svg/EditSvg'
import PhotoCameraSvg from 'components/svg/PhotoCameraSvg'
import UsersSvg from 'components/svg/UsersSvg'
import BackBtn from 'components/ui/BackBtn'
import Button from 'components/ui/Button'
import UserPic from 'components/ui/UserPic'
import { useCommunityContext } from 'context/community_state'
import { useAppContext } from 'context/state'
import { useUserContext } from 'context/user_state'
import ICommunity from 'data/interfaces/ICommunity'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FILES } from 'types/constants'
import { ModalType } from 'types/enums'
import Formatter from 'utils/formatter'
import SettingSvg from 'components/svg/SettingSvg'
import styles from './index.module.scss'

interface Props {
  community: ICommunity
}

export default function CommunityHeader({community}: Props) {
  
  const communityContext = useCommunityContext()
  const userContext = useUserContext()
  const appContext = useAppContext()
  const {isTabletWidth} = useResize()
  const router = useRouter()
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
      {isAdmin && !isTabletWidth &&
        <Button className={styles.editCover} ><EditSvg/> Изменить обложку</Button>
        ||
        isAdmin && isTabletWidth &&
        <Button className={styles.editCover} onClick={()=>appContext.showModal(ModalType.EditCommunityModal, community)}><SettingSvg/></Button>
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
      <p className={styles.members} onClick={()=>appContext.showModal(ModalType.MembersModal, [...communityContext.communityMembers.values()])}>
        <UsersSvg/>
        {Formatter.formatNumber(Number(community.membersCount))} {Formatter.pluralize(+community.membersCount, 'участник', 'участника', 'участников')}
      </p>
      {
        isAdmin && !isTabletWidth &&
        <Button className={styles.editCommunity} onClick={()=>appContext.showModal(ModalType.EditCommunityModal, community)}>Настройки сообщества</Button>
        ||
        isAdmin && isTabletWidth &&
        <Button className={styles.createButton} onClick={()=>appContext.showModal(ModalType.CreateCommunityArticleModal)}><span>Создать запись</span></Button>
        ||
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
    {isTabletWidth && 
    <BackBtn className={styles.back} onClick={()=>router.back()} bgColor={'transparent'}/>
    }


  </div>)
}