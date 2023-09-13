import { useResize } from 'components/hooks/useResize'
import DotSvg from 'components/svg/DotSvg'
import { useCvContext } from 'context/cv_state'
import { useAppContext } from 'context/state'
import { IChat } from 'data/interfaces/Common'
import { ICV } from 'data/interfaces/ICV'
import { useRouter } from 'next/router'
import { ModalType } from 'types/enums'
import Formatter from 'utils/formatter'
import Button from '../Button'
import FavoritesButton from '../FavoritesButton'
import UserPic from '../UserPic'
import styles from './index.module.scss'

interface ItemProps {
  cv: ICV
  chat?: IChat
  vcId: number
}

export default function CvCard({cv, chat, vcId}: ItemProps) {
  
  const router = useRouter()
  const appContext = useAppContext()
  const {isTabletWidth} = useResize()
  const experience = 
    (cv.experienceInfo&&cv.experienceInfo.length>0&&Formatter.fullTimeLine(cv.experienceInfo?.map(el=>[el.fromDate, el.toDate])))
    // ||
    // cv?.experienceInfo?.length===1&& ('c ' +  cv.experienceInfo[0].fromDate)
    ||
    'Без опыта'
  const cvContext = useCvContext()

  const chatbuttonClickHandler = () => {
    router.push('/chat/' + chat.id + '/')
  }

  const removeFromSaved = () => {
    cvContext.removeCvfromSaved(cv.id)
  }

  const inviteHandler = () => {
    if(isTabletWidth) {
      appContext.showBottomSheet(ModalType.ProposalModal, [cv, vcId])
    }
    else {
      appContext.showModal(ModalType.ProposalModal, [cv, vcId])
    }
  }

  return (
    <div className={styles.itemWrapper}>
    <div className={styles.top}>
      <UserPic size={46} className={styles.userPic}/>
      <p className={styles.position}>{cv.position||cv.categories[0].name||'Должность не указана'}</p>
      <p className={styles.name}>{cv.firstName} {cv.lastName} <DotSvg/> {cv.age} {Formatter.pluralize(cv.age, 'год', 'года', 'лет')}</p>
      <FavoritesButton className={styles.heartButton} isActive={cv.isSavedByCurrentProfile} onClick={removeFromSaved}/>
    </div>
    <div className={styles.middle}>
      <p className={styles.title}>Опыт работы</p>
      <p className={styles.data}>{experience}</p>
    </div>
    {cv.lastExperienceInfo &&
    <div className={styles.middle}>
      <p className={styles.title}>Последнее место работы</p>
      <p className={styles.data}>{cv.lastExperienceInfo?.description&&cv.lastExperienceInfo?.description} {cv.lastExperienceInfo?.company&&('"' + cv.lastExperienceInfo?.company + '"')}</p>
    </div>
    }
    <div className={styles.buttonsWrapper}>
      <Button className={styles.button} onClick={inviteHandler} >Пригласить</Button>
      {chat&& 
        <Button className={styles.buttonBlack} onClick={chatbuttonClickHandler} >Перейти в чат</Button>
      }
    </div>
  </div>
  )
}