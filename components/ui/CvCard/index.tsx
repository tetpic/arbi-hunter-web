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
import { InterfaceLanguage, ModalType } from 'types/enums'
import Formatter from 'utils/formatter'
import Button from '../Button'
import UserPic from '../UserPic'
import IChat from 'data/interfaces/IChat'
import { useVacancyContext } from 'context/vacancy_state'
import { useFavoritesFolderContext } from 'context/favorites_folder_state'
import { useUserContext } from 'context/user_state'
import useAbortController from '@/components/hooks/useAbortController'
import P from '../P'
import { getUserImageSource } from 'utils/helpers'
import { ProfileType } from 'data/interfaces/IRegistration'
import useTranslation from 'next-translate/useTranslation'
import { useFeedbacksContext } from 'context/feedbacks_state'
import ChatRepository from 'data/repositories/ChatRepository'

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
  const feedBacksContext = useFeedbacksContext()
  const userContext = useUserContext()
  const {getNewSignal} = useAbortController()
  const {t, lang} = useTranslation()
 
  
  const experience = 
    (currentCV?.experienceInfo
      &&currentCV?.experienceInfo.length>0
      &&Formatter.fullTimeLine(currentCV.experienceInfo?.map(el=>[el.fromDate, el.toDate])))
    ||
    t('workExperience_no')
  const cvContext = useCvContext()

  const chatbuttonClickHandler = () => {
    if(chat?.id) {
      router.push('/messenger?chat=' + chat.id)
    }
    else {
      ChatRepository.getChatByContactId(cv.profileId, {proposalId: application?.id})
      .then(res => {
        router.push('/messenger?chat=' + res.id)
      })
      .catch(er => {
        // eslint-disable-next-line no-console
        console.warn(er)
      })
    }
  }

  // const addToSaved = (signal: AbortSignal, folderId?: number ) => {
  //   CvRepository.addCvToSaved({id: cv.id, favouriteFolderId: folderId}, {signal})
  //   .then(res=> {
  //     props.onChangeItem(res)      
  //   })
  //   .catch(_=>{})
  // }

  // const removeFromSaved = (signal: AbortSignal) => {
  //   CvRepository.removeCvFromSaved(cv.id, {signal})
  //   .then(res=> {
  //     props.onChangeItem(res)
  //   })
  //   .catch(_=>{})
  // }

  // const showFolderModal = (signal: AbortSignal) =>{
  //   const _modalArgs:ChooseFolderToSaveArgs = {
  //     initialFolders: folderContext.allFolders,
  //     onChoose: (folderId) => {
  //       addToSaved(signal, folderId)
  //     }

  //   }
  //   isTabletWidth
  //   ? appContext.showBottomSheet<ChooseFolderToSaveArgs>(ModalType.ChooseFolderToSave, _modalArgs)
  //   :appContext.showModal<ChooseFolderToSaveArgs>(ModalType.ChooseFolderToSave, _modalArgs)
  // }

  // const saveHandler = (e: React.MouseEvent<Element, MouseEvent>) => {
  //   e.preventDefault()
  //   e.stopPropagation()
  //   const [signal] = getNewSignal('likeHandler')
  //   if(!cv.isSavedByCurrentProfile) {
  //     userContext.currentProfile.addSavedToDefaultFolder?addToSaved(signal):showFolderModal(signal)
  //   }
  //   else {
  //     removeFromSaved(signal)
  //   }
  // }

  useEffect(()=>{
    setCurrentCV(cv)
  }, [cv])


  const inviteHandler = () => {
    const _args: IProposalModalProps =  {application: application, 
      cv: cv, 
      page: application?ProposalModalPager.Invite:ProposalModalPager.OtherVacancy,
      activeVacancies: [...vacancyContext.activeVacancies.values()],
      createProposal: feedBacksContext.createProposal
    }
    isTabletWidth
     ? appContext.showBottomSheet<IProposalModalProps>(ModalType.ProposalModal, _args)
     : appContext.showModal<IProposalModalProps>(ModalType.ProposalModal, _args)
  }

  return (
    <div className={styles.itemWrapper}>
    <div className={styles.top} onClick={()=>(application?.cvId||cv?.id)&&router.push(application?.cvId?'/cv/'+application?.cvId: '/cv/'+cv?.id)}>
      <UserPic size={46} image={getUserImageSource(application?.profile?.profileType === ProfileType.Employee?application?.profile:cv?.profile)} className={styles.userPic}/>
      <P styleType={['large', 'w600']} useThemeColor  className={styles.position}>
        {currentCV?.position||currentCV?.categories[0].name||currentCV.categories[0].translations[0].name||t('cv_item_setPosition')}
      </P>
      <P styleType={['small', 'w500', 'greyLight']} className={styles.name}>{currentCV?.firstName} {currentCV?.lastName} <DotSvg/> {currentCV?.age} {Formatter.pluralize(currentCV?.age, t('year1'), t('year2'), t('year3'))}</P>
      <P styleType={['small', 'greyLight', 'w600']} className={styles.fback}>Отклик</P>
      <P 
      styleType={['small', 'w600' ]}
      className={styles.timeStamp} 
      style={{marginLeft: 'auto'}}>
        {Formatter.formatDate(application.createdAt, {
          lang: lang as InterfaceLanguage,
          timeOptions: {year: 'numeric', month: '2-digit'}
        })}
      </P>
    </div>
    <div className={styles.middle}>
      <P styleType={['small', 'w500', 'greyLight']} >{t('cv_item_experience')}</P>
      <P styleType={['small', 'w500']} useThemeColor className={styles.data}>{experience}</P>
    </div>
    {cv?.lastExperienceInfo &&
    <div className={styles.middle}>
      <P styleType={['small', 'w500', 'greyLight']} >{t('cv_item_lastWorkPlace')}</P>
      <P styleType={['small', 'w500']} useThemeColor className={styles.data}>{currentCV?.lastExperienceInfo?.description&&currentCV?.lastExperienceInfo?.description} {currentCV?.lastExperienceInfo?.company&&('"' + currentCV?.lastExperienceInfo?.company + '"')}</P>
    </div>
    }
    {
      currentCV?.proposalByCurrentUser&&
      <div className={styles.middle}>
        <P styleType={['medium', 'w500', 'greyLight']} >{t('cv_item_inviteHasSend')}</P>
      </div>
    }

    <div className={styles.buttonsWrapper}>
      <Button styleType={['gradient', 'phoneWide']} className={styles.button} onClick={inviteHandler}>{t('cv_item_invite')}</Button>
      <Button styleType={['grey']} altStyleType={['white']} onClick={chatbuttonClickHandler} >{t('cv_item_chat')}</Button>
    
    </div>
  </div>
  )
}

