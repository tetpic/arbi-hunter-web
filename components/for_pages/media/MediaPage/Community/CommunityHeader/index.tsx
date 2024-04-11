import styles from './index.module.scss'

import { useResize } from 'components/hooks/useResize'
import PhotoCameraSvg from 'components/svg/PhotoCameraSvg'
import UsersSvg from 'components/svg/UsersSvg'
import BackBtn from 'components/ui/BackBtn'
import Button from 'components/ui/Button'
import UserPic from 'components/ui/UserPic'
import { useCommunityContext } from 'context/community_state'
import { useAppContext } from 'context/state'
import { useUserContext } from 'context/user_state'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ModalType, Preset } from 'types/enums'
import Formatter from 'utils/formatter'
import SettingSvg from 'components/svg/SettingSvg'
import { ICommunityMembersModalProps } from 'components/modals/MembersModal'
import ImageHelper from 'utils/ImageHelper'



export default function CommunityHeader() {
  const communityContext = useCommunityContext()
  const userContext = useUserContext()
  const appContext = useAppContext()
  const {isTabletWidth} = useResize()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>()

  const buttonHandler = async () => { 
    setIsLoading(true)
    await communityContext.communitySubsription(communityContext.currentCommunity.id, communityContext.currentCommunity.isSubscribedByCurrentProfile)
    setIsLoading(false)
  }

  const size = 114
  const isAdmin = communityContext.currentCommunity.profile?.id === userContext.currentProfile?.id

  const camera = (
    <div className={styles.svgWrapper}  style={{width: size, height: size}}>
      <PhotoCameraSvg/>
    </div>
  )

  const openMembersModal = () => {
    appContext.showModal<ICommunityMembersModalProps>(ModalType.MembersModal, {
      members: communityContext.communityMembers,
      onSearch: (page, search) => communityContext.searchCommunityMembers(page, search)
    })
  }

  return (<div className={styles.root}> 
    <div className={styles.background}>
      {communityContext.currentCommunity.image &&
        <Image 
        key={communityContext.currentCommunity.image.source} 
        src={ImageHelper.urlFromFile(communityContext.currentCommunity.image, Preset.lgResize)} 
        alt={communityContext.currentCommunity.name + ' background'} 
        fill/>
      }
      {//isAdmin && !isTabletWidth &&
        //<Button className={styles.editCover} ><EditSvg/> Изменить обложку</Button>
        //||
        isAdmin && isTabletWidth &&
        <Button className={styles.editCover} onClick={()=>appContext.showModal(ModalType.EditCommunityModal, communityContext.currentCommunity)}><SettingSvg/></Button>
      }
    </div>
    <div className={styles.content}>
      <UserPic 
      className={styles.userPic} 
      image={communityContext.currentCommunity?.logo?.source&&ImageHelper.urlFromFile(communityContext.currentCommunity.logo)} 
      icon={communityContext.currentCommunity.profile?.id === userContext.currentProfile?.id&&!communityContext.currentCommunity.logo&&camera} 
      size={size}
      />
      <p className={styles.name}>{communityContext.currentCommunity.name}</p>
      {
        userContext.currentProfile &&
        <p className={styles.members} onClick={()=>openMembersModal()}>
          <UsersSvg/>
          {Formatter.formatNumber(Number(communityContext.currentCommunity.membersCount))} {Formatter.pluralize(+communityContext.currentCommunity.membersCount, 'участник', 'участника', 'участников')}
        </p>
      }
      {
        isAdmin && !isTabletWidth && 
        <Button className={styles.editCommunity} onClick={()=>appContext.showModal(ModalType.EditCommunityModal, communityContext.currentCommunity)}>Настройки сообщества</Button>
        ||
        isAdmin && isTabletWidth &&
        <Button className={styles.createButton} onClick={()=>appContext.showModal(ModalType.CreateCommunityArticleModal)}><span>Создать запись</span></Button>
        ||
        userContext.currentProfile &&
        <Button 
        isProcess={isLoading}
        disabled={isLoading}
        className={styles.button}
        onClick={buttonHandler} 
        >
          {communityContext.currentCommunity.isSubscribedByCurrentProfile?'Отписаться':'Подписаться'}
        </Button>
      }
    </div>
    {isTabletWidth && 
    <BackBtn className={styles.back} onClick={()=>router.back()} bgColor={'transparent'}/>
    }


  </div>)
}