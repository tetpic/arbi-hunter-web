import styles from './index.module.scss'

import { useResize } from 'components/hooks/useResize'
import Button from 'components/ui/Button'
import Statistics from 'components/ui/Statistics'
import ThreeDotsButton from 'components/ui/ThreeDotsButton'
import UserPic from 'components/ui/UserPic'
import { useAppContext } from 'context/state'
import { ICV } from 'data/interfaces/ICV'
import { ModalType } from 'types/enums'
import Formatter from 'utils/formatter'
import { useDetectOutsideClick } from 'components/hooks/useDetectOutsideClick'
import { useRef } from 'react'
import CvVcOptionsModal, { ICvVcOptionsModalProps } from 'components/modals/OptionsModal'
import classNames from 'classnames'
import { useCvContext } from 'context/cv_state'
import { colors } from 'styles/variables'
import { ProfilePages, useProfilePageContext } from 'context/profile_page_state'
import { useFeedbacksContext } from 'context/feedbacks_state'
import { IConfirmModalProps } from 'components/modals/ConfirmModal'

interface Props {
  cv: ICV
  isLast?: boolean
}

export default function CVItem({cv, isLast}: Props) {
  const appContext = useAppContext()
  const profilePageContext = useProfilePageContext()
  const feedBackContext = useFeedbacksContext()
  const cvContext = useCvContext()
  const {isTabletWidth} = useResize()
  const dropRef = useRef(null!)
  const [dropDown, openDropDown] = useDetectOutsideClick(dropRef, false)

  const archiveHandler =()=> {
    cvContext.updateCv(cv.id, {...cv, published: !cv?.published, salary: Number(cv.salary)})
  }

  const editHandler =() => {
    cvContext.editCv(cv)
  }

  const removeHandler =()=> {
    appContext.showModal<IConfirmModalProps>(ModalType.ConfirmModal, 
      {text: 'Вы действительно хотите удалить резюме?',
      callback: ()=>{
        cvContext.deleteCv(cv.id)
      }
      }
    )
  }

  const options = (<>
    <p className={styles.option} onClick={archiveHandler}>{cv?.published?'Архивировать':'Опубликовать'}</p>
    <p className={styles.option}>Дублировать</p>
    <p className={styles.option}>Поделиться</p>
    <p className={styles.option}>Продлить и Поднять</p>
    <p className={styles.option}>Улучшить</p>
    <p className={styles.option} onClick={editHandler}>Редактировать</p>
    <p className={styles.option} onClick={(e)=> {e.stopPropagation();removeHandler()}}  style={{color: colors.red}}>Удалить</p>
   </>)

  const openModal = () => {
    if(isTabletWidth) {
      appContext.showBottomSheet<ICvVcOptionsModalProps>(ModalType.CvVcOptionsModal, {cv: cv, children: options})
    }
    else {
      openDropDown(!dropDown)
    }
  }

  const showFeedbacksForVacancy = () => {
    // feedBackContext.setCVResponses(cv.id)
    feedBackContext.setCurrentCvResponsesState({cvId: cv.id})
    profilePageContext.pager(ProfilePages.FeedBacks)
  }

  const vacanciesCounter = Number(cv.totalProposals) + Number(cv.totalApplications)

  return (<div className={styles.root}> 
    <div className={styles.top}>
      <UserPic className={styles.userPic}/>
      <p className={styles.position}>{cv.categories[0].name||'Должность не указана'}</p>
      <p className={styles.refreshed}>Обновлено {Formatter.formatToShortYear(cv.updatedAt)}</p>
      <ThreeDotsButton className={styles.dots} onClick={openModal}/>
      {!isTabletWidth &&
        <div ref={dropRef} className={classNames(styles.modalWrapper, dropDown&&styles.modalWrapper_active)}>
          <CvVcOptionsModal isLast={isLast} onClose={()=>openDropDown(false)} outerData={{cv: cv}}>
            {options}
          </CvVcOptionsModal>
        </div>
      }
    </div>

    <Statistics 
    title={'Статистика за неделю'}
    className={styles.stats}
    items={[
      {name: 'Просмотры', count: cv.totalViews},
      {name: 'Приглашения', count: cv.totalProposals},
    ]} 
    />
    
    <div className={styles.buttonsWrapper}>
      {cv.moderationStatus !== 'approved' &&
        <p className={styles.refreshed}>На модерации</p>
      }
      <Button className={styles.button}>Поднять в поиске</Button>
      <Button 
      className={styles.buttonBlack} 
      onClick={showFeedbacksForVacancy}

      >
        {vacanciesCounter} {Formatter.pluralize(vacanciesCounter, 'вакансия', 'вакансии', 'вакансий')}
      </Button>
    </div>
  </div>)
}