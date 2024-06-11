import styles from './index.module.scss'

import { useResize } from 'components/hooks/useResize'
import { IProposalModalProps, ProposalModalPager } from 'components/modals/ProposalModal'
import DotSvg from 'components/svg/DotSvg'
import { useCvContext } from 'context/cv_state'
import { useAppContext } from 'context/state'
import { IApplication } from 'data/interfaces/IApplication'
import { ICV } from 'data/interfaces/ICV'
import { useRouter } from 'next/router'
import {  useEffect, useState } from 'react'
import { ModalType } from 'types/enums'
import Formatter from 'utils/formatter'
import Button from '../Button'
import UserPic from '../UserPic'
import IChat from 'data/interfaces/IChat'
import { useVacancyContext } from 'context/vacancy_state'
import FavoritesButton from '../FavoritesButton'
import CvRepository from 'data/repositories/CvRepository'
import { ChooseFolderToSaveArgs } from '@/components/modals/ChooseFolderToSave'
import { useFavoritesFolderContext } from 'context/favorites_folder_state'
import { useUserContext } from 'context/user_state'
import useAbortController from '@/components/hooks/useAbortController'
import P from '../P'
import { getUserImageSource } from 'utils/helpers'
import { ProfileType } from 'data/interfaces/IRegistration'
import useTranslation from 'next-translate/useTranslation'

interface ItemProps {
  cv: ICV
  chat?: IChat
  application?: IApplication
  vcId?: number
  onChangeItem?: (cv?: ICV)=> void
}



export default function CvCard({cv, chat, vcId, application, ...props}: ItemProps) {
  const router = useRouter()
  const appContext = useAppContext()
  const {isTabletWidth} = useResize()
  const [currentCV, setCurrentCV] = useState<ICV>(cv)
  const vacancyContext = useVacancyContext()
  const folderContext = useFavoritesFolderContext()
  const userContext = useUserContext()
  const {getNewSignal} = useAbortController()
  const {t} = useTranslation()
 
  
  const experience = 
    (currentCV?.experienceInfo
      &&currentCV?.experienceInfo.length>0
      &&Formatter.fullTimeLine(currentCV.experienceInfo?.map(el=>[el.fromDate, el.toDate])))
    ||
    t('workExperience_no')
  const cvContext = useCvContext()

  const chatbuttonClickHandler = () => {
    router.push('/messenger?chat=' + chat.id)
  }

  const addToSaved = (signal: AbortSignal, folderId?: number ) => {
    CvRepository.addCvToSaved({id: cv.id, favouriteFolderId: folderId}, {signal})
    .then(res=> {
      props.onChangeItem(res)      
    })
    .catch(_=>{})
  }

  const removeFromSaved = (signal: AbortSignal) => {
    CvRepository.removeCvFromSaved(cv.id, {signal})
    .then(res=> {
      props.onChangeItem(res)
    })
    .catch(_=>{})
  }

  const showFolderModal = (signal: AbortSignal) =>{
    const _modalArgs:ChooseFolderToSaveArgs = {
      initialFolders: folderContext.allFolders,
      onChoose: (folderId) => {
        addToSaved(signal, folderId)
      }

    }
    isTabletWidth
    ? appContext.showBottomSheet<ChooseFolderToSaveArgs>(ModalType.ChooseFolderToSave, _modalArgs)
    :appContext.showModal<ChooseFolderToSaveArgs>(ModalType.ChooseFolderToSave, _modalArgs)
  }

  const saveHandler = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()
    const [signal] = getNewSignal('likeHandler')
    if(!cv.isSavedByCurrentProfile) {
      userContext.currentProfile.addSavedToDefaultFolder?addToSaved(signal):showFolderModal(signal)
    }
    else {
      removeFromSaved(signal)
    }
  }

  useEffect(()=>{
    setCurrentCV(cv)
  }, [cv])


  const inviteHandler = () => {
    if(isTabletWidth) {
      appContext.showBottomSheet<IProposalModalProps>(ModalType.ProposalModal, 
        {application: application, 
          cv: cv, 
          page: application?ProposalModalPager.Invite:ProposalModalPager.OtherVacancy,
          activeVacancies: [...vacancyContext.activeVacancies.values()]          
        })
    }
    else {
      appContext.showModal<IProposalModalProps>(ModalType.ProposalModal, 
        {application: application, 
          fn: props.onChangeItem, 
          cv: cv, 
          page: application?ProposalModalPager.Invite:ProposalModalPager.OtherVacancy,
          activeVacancies: [...vacancyContext.activeVacancies.values()]
        })
    }
  }

  return (
    <div className={styles.itemWrapper}>
    <div className={styles.top} onClick={()=>(application?.cvId||cv?.id)&&router.push(application?.cvId?'/cv/'+application?.cvId: '/cv/'+cv?.id)}>
      <UserPic size={46} image={getUserImageSource(application.profile.profileType === ProfileType.Employee?application.profile:cv.profile)} className={styles.userPic}/>
      <P styleType={['large', 'w600']} useThemeColor  className={styles.position}>
        {currentCV?.position||currentCV?.categories[0].name||t('cv_item_setPosition')}
      </P>
      <P styleType={['medium', 'w500', 'greyLight']} className={styles.name}>{currentCV?.firstName} {currentCV?.lastName} <DotSvg/> {currentCV?.age} {Formatter.pluralize(currentCV?.age, t('year1'), t('year2'), t('year3'))}</P>
      {/* <LikeButton className={styles.heartButton} active={currentCV?.isSavedByCurrentProfile} onClick={saveHandler}/> */}
      <FavoritesButton showStar className={styles.heartButton} isActive={currentCV?.isSavedByCurrentProfile} onClick={saveHandler}/>
    </div>
    <div className={styles.middle}>
      <P styleType={['medium', 'w500', 'greyLight']} >{t('cv_item_experience')}</P>
      <P styleType={['medium', 'w500']} useThemeColor className={styles.data}>{experience}</P>
    </div>
    {cv?.lastExperienceInfo &&
    <div className={styles.middle}>
      <P styleType={['medium', 'w500', 'greyLight']} >{t('cv_item_lastWorkPlace')}</P>
      <P styleType={['medium', 'w500']} useThemeColor className={styles.data}>{currentCV?.lastExperienceInfo?.description&&currentCV?.lastExperienceInfo?.description} {currentCV?.lastExperienceInfo?.company&&('"' + currentCV?.lastExperienceInfo?.company + '"')}</P>
    </div>
    }
    {
      currentCV?.proposalByCurrentUser&&
      <div className={styles.middle}>
        <P styleType={['medium', 'w500', 'greyLight']} >{t('cv_item_inviteHasSend')}</P>
      </div>
    }
    <div className={styles.buttonsWrapper}>
      <Button className={styles.button} onClick={inviteHandler}>{t('cv_item_invite')}</Button>
      {chat&& 
        <Button styleType={['black']} altStyleType={['white']} onClick={chatbuttonClickHandler} >{t('cv_item_chat')}</Button>
      }
    </div>
  </div>
  )
}

