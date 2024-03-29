import styles from './index.module.scss'

import { useResize } from 'components/hooks/useResize'
import Button from 'components/ui/Button'
import Statistics from 'components/ui/Statistics'
import ThreeDotsButton from 'components/ui/ThreeDotsButton'
import UserPic from 'components/ui/UserPic'
import { useAppContext } from 'context/state'
import { ICV } from 'data/interfaces/ICV'
import { ModalType} from 'types/enums'
import Formatter from 'utils/formatter'
import { useDetectOutsideClick } from 'components/hooks/useDetectOutsideClick'
import { useRef } from 'react'
import classNames from 'classnames'
import { useCvContext } from 'context/cv_state'
import { colors } from 'styles/variables'
import { IConfirmModalProps } from 'components/modals/ConfirmModal'
import { IOptionsModalProps } from 'components/modals/OptionsModal'
import OptionsList, { IOptionList } from 'components/ui/OptionsList'
import OptionsDropDown from 'components/ui/OptionsDropDown'
import Progress from '../../../companyProfile/Vacancies/ProfileVacancyItem/Progress'
import { useRouter } from 'next/router'
import { useTariffContext } from 'context/tariff_state'
import P from '@/components/ui/P'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  cv: ICV
  isLast?: boolean
  className?: string
  cardMode?: boolean
  image?: string
  type?: 'drafts' | 'archive'
}

export default function ProfileCvItem({cv, isLast, ...props}: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const cvContext = useCvContext()
  const {isTabletWidth} = useResize()
  const dropRef = useRef(null!)
  const [dropDown, openDropDown] = useDetectOutsideClick(dropRef, false)
  const router = useRouter()
  const tariffContext = useTariffContext()
  const tariff = tariffContext.packets?.get(cv.subscriptions?.tariff?.id)||tariffContext.packets.get(1)


  const archiveHandler =(e: React.MouseEvent<HTMLElement>)=> {
    e.preventDefault()
    e.stopPropagation()
    if(!cv?.subscriptions && !cv.published) {
      router.push({pathname:'/create/cv', query: {id: cv.id, progress: 7}})
      return
    }
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

  const upgradeTariffHandler = () => {
    router.push({pathname: '/shop', query: {page: 'packets'}})
  }

  const defaultOptions:IOptionList[] = [
    {title: cv?.published?'Архивировать':'Опубликовать', onClick: archiveHandler},
    {title: 'Дублировать'},
    {title: 'Поделиться'},
    {title: 'Продлить и Поднять'},
    {title: 'Улучшить', onClick: upgradeTariffHandler},
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

  const showVacancies = () => {
    router.push({pathname: '/recruiting', query: {filters: JSON.stringify({categories: [cv.categories[0]?.baseId]})}})
  }



  const vacanciesCounter = cv.categories[0].vacanciesCount||0

  return (<div className={classNames(styles.root, props.className)} onClick={()=>router.push(`/cv/${cv.id}`)}> 
    <div className={styles.top}>
      <UserPic className={styles.userPic} image={props.image}/>
      <p className={styles.position}>{cv.categories[0]?.name||t('cv_item_setPosition')}</p>
      <p className={styles.refreshed}>{t('cv_item_refreshed')} {Formatter.formatToShortYear(cv.updatedAt)}</p>
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

    {tariff &&
      <P
      styleType={['medium', 'w500']}
      className={styles.tariff} 
      // @ts-ignore
      style={tariff.colors&&{'--gradientColor1': '#'+tariff.colors?.[0], '--gradientColor2': '#'+tariff.colors?.[1]}}
      >
        {tariff.name}
      </P>
    }


    {(props.type !== 'drafts' || !cv.completedSteps) &&
      <Statistics 
      title={t('item_statistics')}     
      items={[
        {name: t('item_shows'), count: cv.totalProposals},
        {name: t('item_views'), count: cv.totalViews},
        {name: t('item_feedbacks'), count: cv.totalApplications},
      ]}
      />
      ||
      cv.completedSteps &&
      <Progress stepsCount={7} className={styles.stats} progress={cv.completedSteps}/>
    }

    {!props.cardMode &&    
      <div className={styles.buttonsWrapper}>
        {cv.moderationStatus !== 'approved' && props.type !== 'drafts' &&
          <p className={styles.refreshed}>{t('item_onModeration')}</p>
        }

        {cv.published && cv.moderationStatus === 'approved' &&
          <Button
          styleType={['gradient']}
          >
            {t('item_upriseInSearch')}
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
            {t('item_publish')}
          </Button>
        }

        {cv.completedSteps?.length <=5 && props.type === 'drafts' &&
          <Button styleType={['gradient']} 
          onClick={(e)=>{
            e.preventDefault()
            e.stopPropagation()
            router.push({pathname: '/create/cv/', query: {id: cv.id, progress: cv.completedSteps.length}})}
          }>
            {t('item_continueEditing')}
          </Button>
        }

        {props.type === 'drafts' && cv.completedSteps?.length > 5 &&
          <Button styleType={['black']}>{t('item_edit')}</Button>
        }

        {(cv.published || cv.publishedAt) && cv.moderationStatus === 'approved'&& props.type && 
          <Button 
          styleType={['black']}
          onClick={(e)=> {
            e.stopPropagation()
            e.preventDefault()
            showVacancies()}
          }>
            {vacanciesCounter} {Formatter.pluralize(vacanciesCounter, t('vacancies1'), t('vacancies2'), t('vacancies3'))}
          </Button>
        }
        {!props.type &&
          <Button 
          styleType={['black']}
          onClick={(e)=> {
            e.stopPropagation()
            e.preventDefault()
            showVacancies()}
          }>
            {t('vacancy_item_relevant')}
          </Button>
        }
      </div>
      }
  </div>)
}