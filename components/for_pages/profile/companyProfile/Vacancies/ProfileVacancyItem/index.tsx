import styles from './index.module.scss'

import { useResize } from 'components/hooks/useResize'
import Button from 'components/ui/Button'
import SalaryItem from 'components/ui/SalaryItem'
import Statistics from 'components/ui/Statistics'
import ThreeDotsButton from 'components/ui/ThreeDotsButton'
import { useAppContext } from 'context/state'
import { useVacancyContext } from 'context/vacancy_state'
import { IVacancy } from 'data/interfaces/IVacancy'
import { useRouter } from 'next/router'
import { ModalType, ModerationStatusType} from 'types/enums'
import Formatter from 'utils/formatter'

import  { IOptionsModalProps } from 'components/modals/OptionsModal'
import {  useRef } from 'react'
import { useDetectOutsideClick } from 'components/hooks/useDetectOutsideClick'
import { IConfirmModalProps } from 'components/modals/ConfirmModal'
import OptionsList, { IOptionList } from 'components/ui/OptionsList'
import { colors } from 'styles/variables'
import OptionsDropDown from 'components/ui/OptionsDropDown'
import Progress from './Progress'
import P from '@/components/ui/P'
import { useTariffContext } from 'context/tariff_state'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  vacancy: IVacancy
  isActive?: boolean
  isLast?: boolean
  cardMode?: boolean
  type?: 'drafts' | 'archive'
  onChange?: (v: Partial<IVacancy>) => void
  onRemove?: (vacancyId: number) => void
}

export default function ProfileVacancyItem({vacancy, isActive, isLast, ...props}: Props) {
  const {t} = useTranslation()
  const router = useRouter()
  const vacancyContext = useVacancyContext() 
  const appContext = useAppContext()
  const tariffContext = useTariffContext()
  const {isTabletWidth} = useResize()
  const dropRef = useRef(null!)
  const [dropDown, openDropDown] = useDetectOutsideClick(dropRef, false)
  const tariff = tariffContext.packets?.get(vacancy.subscriptions?.tariff?.id)

  const archiveHandler =()=> {
    if(!vacancy.subscriptions && !vacancy.published) {
      router.push({pathname: '/create/vacancy', query: {id: vacancy.id, progress: 8}})
      return
    }
    vacancyContext.editVacancy({...vacancy, published: !vacancy.published, salaryMin: Number(vacancy.salaryMin), salaryMax: Number(vacancy.salaryMax)}, vacancy.id, vacancy.published?'active':'archive')
  }

  const editHandler =() => {
    vacancyContext.editVcInEditor(vacancy)
  }

  const removeHandler =()=> {
    appContext.showModal<IConfirmModalProps>(ModalType.ConfirmModal, 
      {text: t('vacancy_item_areYouShureToDelete'),
      callback: ()=>{
        vacancyContext.removeVacancy(vacancy.id, props.type)
        props.onRemove(vacancy.id)
      }
    })
  }

  const upgradeTariffHandler = () => {
    router.push({pathname:'/shop', query: {page: 'packets'}})
  }

  const defaultOptions:IOptionList[] = [
    {title: t('item_edit'), onClick: editHandler},
    {title: vacancy?.published?t('item_archive'):t('item_publish'), onClick: archiveHandler},
    {title: t('item_upgrade'), onClick: upgradeTariffHandler},
    {title: t('item_share')},
    {title: t('item_remove'), onClick: (e: any)=> {e.stopPropagation();removeHandler()}, style: {color: colors.red}},
  ]

  const draftOptions:IOptionList[] = [
    {title: 'Редактировать', onClick: editHandler},
    {title: 'Удалить', onClick: (e)=> {e.stopPropagation();removeHandler()}, style: {color: colors.red}},
  ]

  const archiveOptions:IOptionList[] = [
    {title: 'Редактировать', onClick: editHandler},
    {title: 'Опубликовать', onClick: archiveHandler},
    {title: 'Удалить', onClick: (e)=> {e.stopPropagation();removeHandler()}, style: {color: colors.red}},
  ]

  const options = <OptionsList options={props.type === 'drafts'&&draftOptions||props.type === 'archive'&&archiveOptions||defaultOptions}
  onMouseLeave={()=>openDropDown(false)}
  />

  const openModalHandler =(e: React.MouseEvent<Element, MouseEvent>)=> {
    e.preventDefault()
    e.stopPropagation()
    if (isTabletWidth) {
      appContext.showBottomSheet<IOptionsModalProps>(ModalType.OptionsModal, {children: options}, 430)
    }
    else {
      openDropDown(!dropDown)
    }
  }

  return (
    <div className={styles.item} onClick={()=>router.push(`/vacancy/${vacancy.id}`)}> 
      <div className={styles.top}>
        {vacancy.publishedAt && vacancy.published &&
          <p className={styles.timeRemains}>Истекает {Formatter.formatDate(vacancy.publishedAt, {plusDays: 30})}</p>
        }
        {props.type === 'drafts' && vacancy.updatedAt &&
          <P className={styles.timeSaved}>Сохранен {Formatter.formatDate(vacancy.updatedAt, {timeOptions: {year: 'numeric'}})}</P>
        }
        {props.type === 'archive' && vacancy.updatedAt &&
          <p className={styles.timeSaved}>В архиве {Formatter.formatDate(vacancy.updatedAt, {timeOptions: {year: 'numeric'}})}</p>
        }


        <P styleType={['large', 'w600']} useThemeColor>{vacancy.name}</P>
        {vacancy.city && vacancy.city.locName && !vacancy.isRemote &&
          <p className={styles.city}>г. {vacancy.city?.locName}</p>
        }
        {vacancy.isRemote &&
          <p className={styles.city}>Удаленно</p>
        }
        <SalaryItem vacancy={vacancy}/>

        {tariff &&
          <p 
          className={styles.tariff} 
          /* @ts-ignore */
          style={tariff.colors&&{'--gradientColor1': '#'+tariff.colors?.[0], '--gradientColor2': '#'+tariff.colors?.[1]}}
          >
            {tariff.name}
          </p>
        }

        <ThreeDotsButton  onMouseEnter={openModalHandler} onClick={openModalHandler} className={styles.dots}/>
        {!isTabletWidth && 
          <OptionsDropDown 
          options={options}
          getRef={(r) => {dropRef.current = r}} 
          active={dropDown} 
          isLast={isLast}
          onClose={()=>openDropDown(false)}/>        
        }
      </div>

      {props.type !== 'drafts' &&
        <Statistics 
        title='Статистика за все время'
        items={[
          {name: 'Показы', count: vacancy.totalProposals},
          {name: 'Просмотры', count: vacancy.totalViews},
          {name: 'Отклики', count: vacancy.totalApplications},
        ]}
        />
        ||
        vacancy.completedSteps &&
        <Progress progress={vacancy.completedSteps}/>
      }
      
      {!props.cardMode &&
        <div className={styles.buttonsWrapper}>
          {vacancy.moderationStatus !== ModerationStatusType.Approved && props.type === 'archive' &&
            <P styleType={['medium', 'w500', 'greyLight']}>На модерации</P>
          }
          {!props.type &&
            <>
            <Button 
            stopPropagation
            onClick={(e)=>{
              router.push(`/responses/${vacancy.id}/`)
            }} 
            styleType={['gradient']}>
              Смотреть отклики
            </Button>
            <Button 
            stopPropagation
            onClick={(e)=>{
              router.push({pathname:'/recruiting', query: {filters: JSON.stringify({categories: [vacancy.categories[0].id]}), vcId: vacancy.id}})
            }} 
            styleType={['black']} altStyleType={['white']}  >Подходящие резюме</Button>
            </>
          }
          {props.type === 'archive' && vacancy.moderationStatus === ModerationStatusType.Approved &&
            <>
            <Button styleType={['gradient']} stopPropagation onClick={archiveHandler}>Разместить повторно</Button>
            <Button 
            stopPropagation
            onClick={(e)=>{
              router.push(`/responses/${vacancy.id}/`)
            }} 
            styleType={['black']}
            altStyleType={['whitePurple']}
            >
              Смотреть отклики
            </Button>
            </>
          }
          {props.type === 'drafts' && vacancy.completedSteps?.length < 8 &&
            <Button 
            styleType={['gradient']} 
            stopPropagation 
            onClick={(e)=>{
              e.preventDefault()
              e.stopPropagation()
              router.push({pathname: '/create/vacancy/', query: {id: vacancy.id, progress: vacancy.completedSteps.length}})
            }}
            >
            Продолжить заполнение</Button>
            ||
            props.type === 'drafts' && vacancy.completedSteps?.length >=8 &&
            <>
             <Button styleType={['gradient']} stopPropagation onClick={archiveHandler}>Опубликовать</Button>
             <Button styleType={['black']} onClick={editHandler}>Редактировать</Button>
            </>
          }
        </div>
      }
    </div>
  )
}

