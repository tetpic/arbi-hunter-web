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
import { InterfaceLanguage, ModalType, ModerationStatusType, SnackbarType} from 'types/enums'
import Formatter from 'utils/formatter'

import  { IOptionsModalProps } from 'components/modals/OptionsModal'
import {  useRef } from 'react'
import { useDetectOutsideClick } from 'components/hooks/useDetectOutsideClick'
import OptionsList, { IOptionList } from 'components/ui/OptionsList'
import { colors } from 'styles/variables'
import OptionsDropDown from 'components/ui/OptionsDropDown'
import Progress from './Progress'
import P from '@/components/ui/P'
import { useTariffContext } from 'context/tariff_state'
import useTranslation from 'next-translate/useTranslation'
import { RemoveCvVcConfirmModalArgs } from '@/components/modals/RemoveCvVcConfirmModal'
import { copyToClipboard, daysBetween } from 'utils/helpers'
import classNames from 'classnames'

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
  const {t, lang} = useTranslation()
  const router = useRouter()
  const vacancyContext = useVacancyContext() 
  const appContext = useAppContext()
  const tariffContext = useTariffContext()
  const {isTabletWidth} = useResize()
  const dropRef = useRef(null!)
  const [dropDown, openDropDown] = useDetectOutsideClick(dropRef, false)
  const tariff = tariffContext.packets?.get(vacancy.subscriptions?.tariff?.id)
  const popperRoot = useRef(null!)

  const archiveHandler =()=> {
    if(!vacancy.subscriptions && !vacancy.published) {
      router.push({pathname: '/create/vacancy', query: {id: vacancy.id, progress: 8, fromOtherPage: true}})
      return
    }
    vacancyContext.editVacancy({...vacancy, published: !vacancy.published, salaryMin: Number(vacancy.salaryMin), salaryMax: Number(vacancy.salaryMax)}, vacancy.id, vacancy.published?'active':'archive')
  }

  const editHandler =() => {
    vacancyContext.editVcInEditor(vacancy)
  }

  const removeHandler =()=> {
    const _args:RemoveCvVcConfirmModalArgs = {
      title: t('vacancy_item_removeConfirm')+'?',
      text: !props.type?t('vacancy_item_removeInfoFull'):t('vacancy_item_removeInfoShort'),
      onRemove: () => {
        vacancyContext.removeVacancy(vacancy.id, props.type)
        props.onRemove?.(vacancy.id)
        isTabletWidth?appContext.hideBottomSheet():appContext.hideModal()
      },
      onArchive: !props.type?() => {
        archiveHandler()
        isTabletWidth?appContext.hideBottomSheet():appContext.hideModal()
      }:undefined,
      removeText: t('vacancy_item_removeConfirm'),
      archiveText: t('vacancy_item_hideVacancy')
    }
    isTabletWidth
    ? setTimeout(()=>appContext.showBottomSheet<RemoveCvVcConfirmModalArgs>(ModalType.RemoveCvVcConfirmModal, _args, 300), 200)
    :appContext.showModal<RemoveCvVcConfirmModalArgs>(ModalType.RemoveCvVcConfirmModal, _args)
  }

  const upgradeTariffHandler = () => {
    router.push({pathname:'/shop', query: {page: 'packets'}})
  }

  const copyToClipboardHandler = () => {
    copyToClipboard(process.env.HOST_ROOT + '/vacancy/' + vacancy.id)
    appContext.showSnackbar(t('linkCopied'), SnackbarType.success)
  }

  const allOptions = {
    edit:  {title: t('item_edit'), onClick: editHandler},
    archive: {title: vacancy?.published?t('item_archive'):t('item_publish'), onClick: archiveHandler},
    upgrade: {title: t('item_upgrade'), onClick: upgradeTariffHandler},
    share: {title: t('item_share'), onClick: copyToClipboardHandler },
    remove: {title: t('item_remove'), onClick: (e: any)=> {e.stopPropagation();removeHandler()}, style: {color: colors.red}},
    publish: {title: t('item_publish'), onClick: archiveHandler},
  }

  const defaultOptions:IOptionList[] = [
    allOptions.edit,
    allOptions.archive,
    allOptions.upgrade,
    allOptions.share,
    allOptions.remove
  ]

  const draftOptions:IOptionList[] = [
    allOptions.edit,
    allOptions.remove
  ]

  const archiveOptions:IOptionList[] = [
    allOptions.edit,
    allOptions.publish,
    allOptions.remove
  ]

  const options = <OptionsList options={props.type === 'drafts'&&draftOptions||props.type === 'archive'&&archiveOptions||defaultOptions}
  onMouseLeave={()=>openDropDown(false)}
  />

  const openModalHandler =(e: React.MouseEvent<Element, MouseEvent>)=> {
    e.preventDefault()
    e.stopPropagation()
    if (isTabletWidth) {
      appContext.showBottomSheet<IOptionsModalProps>(ModalType.OptionsModal, {children: options, title: t('vacancy_item_actionsWithVacancy')}, props.type === 'archive'&&280||props.type === 'drafts'&&220||380)
    }
    else {
      openDropDown(!dropDown)
    }
  }

  const publishedAt = new Date(vacancy.publishedAt)
  publishedAt.setDate(publishedAt.getDate()+30)

  const _daysBetween = daysBetween(publishedAt, new Date)

  const getRemainsColor = (_daysBetween: number):string => {
    if(_daysBetween > 0 && _daysBetween <= 7) {
      return 'timeRemains_red'      
    }
    if(_daysBetween > 7 && _daysBetween <= 14) {
      return 'timeRemains_orange'
    }
    if(_daysBetween > 14 && _daysBetween <= 30) {
      return 'timeRemains_green'
    }
  }

  return (
    <div className={styles.item} onClick={()=>router.push(`/vacancy/${vacancy.id}`)}> 
      <div className={styles.top}  >
        {vacancy.publishedAt && vacancy.published &&
          <p className={classNames(styles.timeRemains, styles[getRemainsColor(_daysBetween)])}>{t('item_expires')} {Formatter.formatDate(vacancy.publishedAt, {plusDays: 30, lang: lang as InterfaceLanguage})}</p>
        }
        {props.type === 'drafts' && vacancy.updatedAt &&
          <P className={styles.timeSaved}>{t('item_saved')} {Formatter.formatDate(vacancy.updatedAt, {timeOptions: {year: 'numeric' }, lang: lang as InterfaceLanguage })}</P>
        }
        {props.type === 'archive' && vacancy.updatedAt &&
          <p className={styles.timeSaved}>{t('item_archived')} {Formatter.formatDate(vacancy.updatedAt, {timeOptions: {year: 'numeric'}, lang: lang as InterfaceLanguage})}</p>
        }


        <P styleType={['large', 'w600']} useThemeColor>
          {vacancy.categories[0].key === 'sub-other' 
          ? vacancy.name 
          : (vacancy.categories[0].translations.find(t => t.languageCode === lang)?.name || vacancy.name)}
        </P>
        {vacancy.city && vacancy.city.locName && !vacancy.isRemote &&
          <p className={styles.city}>{t('ruCity')} {vacancy.city?.locName}</p>
        }
        {vacancy.isRemote &&
          <p className={styles.city}>{t('remote')}</p>
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
          key={vacancy.id}
          onClose={()=>openDropDown(false)}/>        
        }
      </div>

      {props.type !== 'drafts' &&
        <Statistics 
        title={t('vacancy_page_statsTitle')}
        items={[
          {name: t('vacancy_page_shows'), count: vacancy.totalShows},
          {name: t('vacancy_page_views'), count: vacancy.totalViews},
          {name: t('vacancy_page_applications'), count: vacancy.totalApplications},
        ]}
        />
        ||
        vacancy.completedSteps &&
        <Progress progress={vacancy.completedSteps} type={'vacancy'}/>
      }
      
      {!props.cardMode &&
        <div className={styles.buttonsWrapper}>
          {vacancy.moderationStatus !== ModerationStatusType.Approved && props.type === 'archive' &&
            <P styleType={['medium', 'w500', 'greyLight']}>{t('item_statusModeration')}</P>
          }
          {!props.type &&
            <>
            <Button 
            stopPropagation
            onClick={(e)=>{
              router.push(`/responses/${vacancy.id}/`)
            }} 
            styleType={['gradient']}>
              {t('item_watchReviews')}
            </Button>
            <Button 
            stopPropagation
            onClick={(e)=>{
              router.push({pathname:'/recruiting', query: {filters: JSON.stringify({categories: [vacancy.categories[0].id]}), vcId: vacancy.id}})
            }} 
            styleType={['black']} altStyleType={['white']}  
            >
              {t('item_relevantCvs')}
            </Button>
            </>
          }
          {props.type === 'archive' && vacancy.moderationStatus === ModerationStatusType.Approved &&
            <>
            <Button styleType={['gradient']} stopPropagation onClick={archiveHandler}>{t('item_publishAgain')}</Button>
            <Button 
            stopPropagation
            onClick={(e)=>{
              router.push(`/responses/${vacancy.id}/`)
            }} 
            styleType={['black']}
            altStyleType={['whitePurple']}
            >
              {t('item_watchReviews')}
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
              {t('item_continueEditing')}
            </Button>
            ||
            props.type === 'drafts' && vacancy.completedSteps?.length >=8 &&
            <>
             <Button styleType={['gradient']} stopPropagation onClick={archiveHandler}
             >
              {t('item_publish')}
            </Button>
             <Button styleType={['black']} altStyleType={['white']} onClick={editHandler}
             >
              {t('item_edit')}
            </Button>
            </>
          }
        </div>
      }
    </div>
  )
}

