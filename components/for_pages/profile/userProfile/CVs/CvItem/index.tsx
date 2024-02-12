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
import classNames from 'classnames'
import { useCvContext } from 'context/cv_state'
import { colors } from 'styles/variables'
import { ProfilePages, useProfilePageContext } from 'context/profile_page_state'
import { useFeedbacksContext } from 'context/feedbacks_state'
import { IConfirmModalProps } from 'components/modals/ConfirmModal'
import { IOptionsModalProps } from 'components/modals/OptionsModal'
import OptionsList from 'components/ui/OptionsList'
import OptionsDropDown from 'components/ui/OptionsDropDown'

interface Props {
  cv: ICV
  isLast?: boolean
  className?: string
  cardMode?: boolean
  image?: string
}

export default function CVItem({cv, isLast, ...props}: Props) {
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

  const options = <OptionsList 
  options={[
    {title: cv?.published?'Архивировать':'Опубликовать', onClick: archiveHandler},
    {title: 'Дублировать'},
    {title: 'Поделиться'},
    {title: 'Продлить и Поднять'},
    {title: 'Улучшить'},
    {title: 'Редактировать', onClick: editHandler},
    {title: 'Удалить', onClick: (e)=> {e.stopPropagation();removeHandler()}, style: {color: colors.red}},
  ]} 
  onMouseLeave={()=>openDropDown(false)}
  />

  const openModal = () => {
    if(isTabletWidth) {
      appContext.showBottomSheet<IOptionsModalProps>(ModalType.OptionsModal, {children: options}, 448)
    }
    else {
      openDropDown(!dropDown)
    }
  }

  const showFeedbacksForVacancy = () => {
    feedBackContext.setCurrentCvResponsesState({cvId: cv.id})
    profilePageContext.pager(ProfilePages.FeedBacks)
  }

  const vacanciesCounter = Number(cv.totalProposals) + Number(cv.totalApplications)

  return (<div className={classNames(styles.root, props.className)}> 
    <div className={styles.top}>
      <UserPic className={styles.userPic} image={props.image}/>
      <p className={styles.position}>{cv.categories[0]?.name||'Должность не указана'}</p>
      <p className={styles.refreshed}>Обновлено {Formatter.formatToShortYear(cv.updatedAt)}</p>
      <ThreeDotsButton className={styles.dots}  onMouseEnter={openModal} onClick={isTabletWidth&&openModal}/>
      {!isTabletWidth &&
       <OptionsDropDown 
       options={options}
       getRef={(r) => {dropRef.current = r}} 
       active={dropDown} 
       onClose={()=>openDropDown(false)}/>       
      }
    </div>

    <Statistics 
    title={'Статистика за неделю'}
    className={styles.stats}
    items={[
      {name: 'Показы ', count: cv.totalShows.toString()},
      {name: 'Просмотры', count: cv.totalViews},
      {name: 'Приглашения', count: cv.totalProposals},
    ]} 
    />

    {!props.cardMode &&    
      <div className={styles.buttonsWrapper}>
        {cv.moderationStatus !== 'approved' &&
          <p className={styles.refreshed}>На модерации</p>
        }
        <Button className={styles.button}>Поднять в поиске</Button>
        <Button 
        className={styles.buttonBorderGradient} 
        onClick={showFeedbacksForVacancy}
        >
          {vacanciesCounter} {Formatter.pluralize(vacanciesCounter, 'вакансия', 'вакансии', 'вакансий')}
        </Button>
      </div>
      }
  </div>)
}