import { useResize } from 'components/hooks/useResize'
import { ProposalModalPager } from 'components/modals/ProposalModal'
import DotSvg from 'components/svg/DotSvg'
import { useCvContext } from 'context/cv_state'
import { useAppContext } from 'context/state'
import { IChat } from 'data/interfaces/Common'
import { IApplication } from 'data/interfaces/IApplication'
import { ICV } from 'data/interfaces/ICV'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { ModalType } from 'types/enums'
import Formatter from 'utils/formatter'
import Button from '../Button'
import FavoritesButton from '../FavoritesButton'
import UserPic from '../UserPic'
import styles from './index.module.scss'

interface ItemProps {
  cv: ICV
  chat?: IChat
  application?: IApplication
  vcId?: number
}

export default function CvCard({cv, chat, vcId, application}: ItemProps) {
  const router = useRouter()
  const appContext = useAppContext()
  const {isTabletWidth} = useResize()
  const [currentCV, setCurrentCV] = useState<ICV>(cv)
  
  const experience = 
    (currentCV?.experienceInfo
      &&currentCV?.experienceInfo.length>0
      &&Formatter.fullTimeLine(currentCV.experienceInfo?.map(el=>[el.fromDate, el.toDate])))
    // ||
    // cv?.experienceInfo?.length===1&& ('c ' +  cv.experienceInfo[0].fromDate)
    ||
    'Без опыта'
  const cvContext = useCvContext()

  const chatbuttonClickHandler = () => {
    router.push('/chat/' + chat.id + '/')
  }

  const saveHandler = useCallback(() => {
    currentCV
    if(currentCV.isSavedByCurrentProfile) {
      
      cvContext.removeCvfromSaved(currentCV.id)
      .then(res=>{
        res===true &&
        setCurrentCV(state=> {return {...state, isSavedByCurrentProfile: false}})
      })
    }
    else {
      cvContext.saveCv(currentCV.id)
      .then(res=> {
        res===true&&
        setCurrentCV(state=> {return {...state, isSavedByCurrentProfile: true}})
      })
    }
  }, [currentCV])

  const inviteHandler = () => {
    if(isTabletWidth) {
      appContext.showBottomSheet(ModalType.ProposalModal, {application: application, cv: cv, page: application?ProposalModalPager.Invite:ProposalModalPager.OtherVacancy})
    }
    else {
      appContext.showModal(ModalType.ProposalModal, {application: application, cv: cv, page: application?ProposalModalPager.Invite:ProposalModalPager.OtherVacancy})
    }
  }

  return (
    <div className={styles.itemWrapper}>
    <div className={styles.top}>
      <UserPic size={46} className={styles.userPic}/>
      <p className={styles.position}>{currentCV.position||currentCV.categories[0].name||'Должность не указана'}</p>
      <p className={styles.name}>{currentCV.firstName} {currentCV.lastName} <DotSvg/> {currentCV.age} {Formatter.pluralize(currentCV.age, 'год', 'года', 'лет')}</p>
      <FavoritesButton className={styles.heartButton} isActive={currentCV.isSavedByCurrentProfile} onClick={saveHandler}/>
    </div>
    <div className={styles.middle}>
      <p className={styles.title}>Опыт работы</p>
      <p className={styles.data}>{experience}</p>
    </div>
    {cv.lastExperienceInfo &&
    <div className={styles.middle}>
      <p className={styles.title}>Последнее место работы</p>
      <p className={styles.data}>{currentCV.lastExperienceInfo?.description&&currentCV.lastExperienceInfo?.description} {currentCV.lastExperienceInfo?.company&&('"' + currentCV.lastExperienceInfo?.company + '"')}</p>
    </div>
    }
    {
      currentCV.proposalByCurrentUser&&
      <div className={styles.middle}>
        <p className={styles.title}>Приглашение выслано</p>
      </div>
    }
    <div className={styles.buttonsWrapper}>
      <Button className={styles.button} onClick={inviteHandler}>{currentCV.proposalByCurrentUser?'Пригласить повторно':'Пригласить'}</Button>
      {chat&& 
        <Button className={styles.buttonBlack} onClick={chatbuttonClickHandler} >Перейти в чат</Button>
      }
    </div>
  </div>
  )
}