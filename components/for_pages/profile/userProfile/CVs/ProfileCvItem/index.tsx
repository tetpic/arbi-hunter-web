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
import OptionsList, { IOptionList } from 'components/ui/OptionsList'
import OptionsDropDown from 'components/ui/OptionsDropDown'
import Progress from '../../../companyProfile/Vacancies/VacancyItem/Progress'
import { useRouter } from 'next/router'

interface Props {
  cv: ICV
  isLast?: boolean
  className?: string
  cardMode?: boolean
  image?: string
  type?: 'drafts' | 'archive'
}

export default function ProfileCvItem({cv, isLast, ...props}: Props) {
  const appContext = useAppContext()
  const profilePageContext = useProfilePageContext()
  const feedBackContext = useFeedbacksContext()
  const cvContext = useCvContext()
  const {isTabletWidth} = useResize()
  const dropRef = useRef(null!)
  const [dropDown, openDropDown] = useDetectOutsideClick(dropRef, false)
  const router = useRouter()

  const archiveHandler =(e: React.MouseEvent<HTMLElement>)=> {
    e.preventDefault()
    e.stopPropagation()
    cvContext.updateCv(cv.id, {published: !cv?.published})
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

  const defaultOptions:IOptionList[] = [
    {title: cv?.published?'Архивировать':'Опубликовать', onClick: archiveHandler},
    {title: 'Дублировать'},
    {title: 'Поделиться'},
    {title: 'Продлить и Поднять'},
    {title: 'Улучшить'},
    {title: 'Редактировать', onClick: editHandler},
    {title: 'Удалить', onClick: (e: any)=> {e.stopPropagation();removeHandler()}, style: {color: colors.red}},
  ]

  const draftOptions:IOptionList[] = [
    {title: 'Редактировать', onClick: editHandler},
    {title: 'Удалить', onClick: (e)=> {e.stopPropagation();removeHandler()}, style: {color: colors.red}},
  ]

  const options = <OptionsList 
  options={props.type === 'drafts'?draftOptions:defaultOptions} 
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

  return (<div className={classNames(styles.root, props.className)} onClick={()=>router.push(`/cv/${cv.id}`)}> 
    <div className={styles.top}>
      <UserPic className={styles.userPic} image={props.image}/>
      <p className={styles.position}>{cv.categories[0]?.name||'Должность не указана'}</p>
      <p className={styles.refreshed}>Обновлено {Formatter.formatToShortYear(cv.updatedAt)}</p>
      <ThreeDotsButton className={styles.dots}  onMouseEnter={openModal} onClick={(e)=> {
        e.stopPropagation()
        e.preventDefault()
        isTabletWidth&&openModal()
        }}/>
      {!isTabletWidth &&
       <OptionsDropDown 
       options={options}
       isLast={isLast}
       getRef={(r) => {dropRef.current = r}} 
       active={dropDown} 
       onClose={()=>openDropDown(false)}/>       
      }
    </div>

    {(props.type !== 'drafts' || !cv.completedSteps) &&
      <Statistics 
      title='Статистика за неделю'
      className={styles.stats}
      items={[
        {name: 'Показы', count: cv.totalProposals},
        {name: 'Просмотры', count: cv.totalViews},
        {name: 'Отклики', count: cv.totalApplications},
      ]}
      />
      ||
      cv.completedSteps &&
      <Progress stepsCount={7} className={styles.stats} progress={cv.completedSteps}/>
    }

    {!props.cardMode &&    
      <div className={styles.buttonsWrapper}>
        {cv.moderationStatus !== 'approved' && props.type !== 'drafts' &&
          <p className={styles.refreshed}>На модерации</p>
        }

        {cv.published && cv.moderationStatus === 'approved' &&
          <Button
          styleType={['gradient']}
          >
            Поднять в поиске
          </Button>
        }

        {(
          ((!cv.published || !cv.publishedAt) &&  cv.moderationStatus === 'approved' && props.type==='archive') 
          || 
          (props.type === 'drafts' && cv.completedSteps?.length > 5) 
        )&&
          <Button
          styleType={['gradient']}
          onClick={archiveHandler}
          >
            Опубликовать
          </Button>
        }

        {cv.completedSteps?.length <=5 && props.type === 'drafts' &&
          <Button styleType={['gradient']} 
          onClick={(e)=>{
            e.preventDefault()
            e.stopPropagation()
            router.push({pathname: '/create/cv/', query: {id: cv.id, progress: cv.completedSteps.length}})}
          }>
            Продолжить заполнение
          </Button>
        }

        {props.type === 'drafts' && cv.completedSteps?.length > 5 &&
          <Button styleType={['black']}>Редактировать</Button>
        }

        {(cv.published || cv.publishedAt) && cv.moderationStatus === 'approved'&&
          <Button 
          styleType={['black']}
          onClick={(e)=> {
            e.stopPropagation()
            e.preventDefault()
            showFeedbacksForVacancy()}}
            >
            {vacanciesCounter} {Formatter.pluralize(vacanciesCounter, 'вакансия', 'вакансии', 'вакансий')}
          </Button>
        }
      </div>
      }
  </div>)
}