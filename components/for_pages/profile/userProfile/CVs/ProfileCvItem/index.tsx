import styles from './index.module.scss'

import { useResize } from 'components/hooks/useResize'
import Button from 'components/ui/Button'
import Statistics from 'components/ui/Statistics'
import ThreeDotsButton from 'components/ui/ThreeDotsButton'
import UserPic from 'components/ui/UserPic'
import { useAppContext } from 'context/state'
import { ICV } from 'data/interfaces/ICV'
import { InterfaceLanguage, ModalType, ModerationStatusType, SnackbarType} from 'types/enums'
import Formatter from 'utils/formatter'
import { useDetectOutsideClick } from 'components/hooks/useDetectOutsideClick'
import { useRef } from 'react'
import classNames from 'classnames'
import { useCvContext } from 'context/cv_state'
import { colors } from 'styles/variables'
import { IOptionsModalProps } from 'components/modals/OptionsModal'
import OptionsList, { IOptionList } from 'components/ui/OptionsList'
import OptionsDropDown from 'components/ui/OptionsDropDown'
import Progress from '../../../companyProfile/Vacancies/ProfileVacancyItem/Progress'
import { useRouter } from 'next/router'
import { useTariffContext } from 'context/tariff_state'
import P from '@/components/ui/P'
import useTranslation from 'next-translate/useTranslation'
import { RemoveCvVcConfirmModalArgs } from '@/components/modals/RemoveCvVcConfirmModal'
import { copyToClipboard } from 'utils/helpers'

interface Props {
  cv: ICV
  isLast?: boolean
  className?: string
  cardMode?: boolean
  image?: string
  type?: 'drafts' | 'archive'
}

export default function ProfileCvItem({cv, isLast, ...props}: Props) {
  const {t, lang} = useTranslation()
  const appContext = useAppContext()
  const cvContext = useCvContext()
  const {isTabletWidth} = useResize()
  const dropRef = useRef(null!)
  const [dropDown, openDropDown] = useDetectOutsideClick(dropRef, false)
  const router = useRouter()
  const tariffContext = useTariffContext()
  const tariff = tariffContext.packets?.get(cv.subscriptions?.tariff?.id)||tariffContext.packets.get(1)


  const archiveHandler =(e?: React.MouseEvent<HTMLElement>)=> {
    if(e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if(!cv.published) {
      router.push({pathname:'/create/cv', query: {id: cv.id, progress: 7, fromOtherPage: true}})
      return
    }
    cvContext.updateCv(cv.id, {published: !cv?.published})
  }

  const editHandler =() => {
    cvContext.editCv(cv)
  }

  const moveToTopHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    cvContext.moveToTop(cv.id)
  }



  const removeHandler =()=> {
    const _args:RemoveCvVcConfirmModalArgs = {
      title: t('cv_item_removeCv') + '?',
      text: !props.type?t('cv_item_removeInfoFull'):t('cv_item_removeInfoShort'),
      onRemove: () => {
        cvContext.deleteCv(cv.id)
        isTabletWidth?appContext.hideBottomSheet():appContext.hideModal()
      },
      onArchive: !props.type?() => {
        archiveHandler()
        isTabletWidth?appContext.hideBottomSheet():appContext.hideModal()
      }:undefined,
      removeText: t('cv_item_removeCv'),
      archiveText: t('cv_item_hideCv')
    }
    isTabletWidth
    ? setTimeout(()=>appContext.showBottomSheet<RemoveCvVcConfirmModalArgs>(ModalType.RemoveCvVcConfirmModal, _args, 180), 200)
    :appContext.showModal<RemoveCvVcConfirmModalArgs>(ModalType.RemoveCvVcConfirmModal, _args)
  }

  const upgradeTariffHandler = () => {
    router.push({pathname: '/create/cv', query: {id: cv.id, progress: 7, fromOtherPage: true, improve: true}})
  }

  const copyToClipboardHandler = () => {
    copyToClipboard(process.env.HOST_ROOT + '/cv/' + cv.id)
    appContext.showSnackbar(t('linkCopied'), SnackbarType.success)
  }

  const defaultOptions:IOptionList[] = [
    // {title: t('item_remove'), onClick: editHandler},
    {title: t('item_edit'), onClick: editHandler},
    {title: cv?.published?t('item_archive'):t('item_publish'), onClick: archiveHandler},
    {title: t('item_upgrade'), onClick: upgradeTariffHandler},
    {title: t('item_share'), onClick: copyToClipboardHandler},
    {title: t('item_remove'), onClick: (e: any)=> {e.stopPropagation();removeHandler()}, style: {color: colors.red}},
  ]

  const draftOptions:IOptionList[] = [
    {title: t('item_edit'), onClick: editHandler},
    {title: t('item_remove'), onClick: (e)=> {e.stopPropagation();removeHandler()}, style: {color: colors.red}},
  ]

  const archiveOptions:IOptionList[] = [
    {title: t('item_edit'), onClick: editHandler},
    (cv.moderationStatus === ModerationStatusType.Approved && {title: t('item_publish'), onClick: archiveHandler}),
    {title: t('item_remove'), onClick: removeHandler, style: {color: colors.red}},
  ].filter(Boolean)

  const options = <OptionsList 
  options={props.type === 'drafts'&&draftOptions||props.type === 'archive'&&archiveOptions||defaultOptions} 
  onMouseLeave={()=>openDropDown(false)}
  />

  const openModal = () => {
    if(isTabletWidth) {
      appContext.showBottomSheet<IOptionsModalProps>(ModalType.OptionsModal, {children: options, title: t('cv_item_actionsWithCv')}, props.type === 'archive'&&280||props.type==='drafts'&&220||380)
    }
    else {
      openDropDown(!dropDown)
    }
  }

  const showVacancies = () => {
    router.push({pathname: '/recruiting', query: {filters: JSON.stringify({categories: [cv.categories[0]?.baseId]})}})
  }

  const cvTopTimePlusTime = () => {
    const time = new Date(cv.topAt)
    time.setHours(time.getHours() + 4 )
    return time
  }

  const vacanciesCounter = cv.categories[0].vacanciesCount||0

  return (<div className={classNames(styles.root, props.className)} onClick={()=>!props.type&&router.push(`/cv/${cv.id}`)}> 
    <div className={styles.top}>
      <UserPic className={styles.userPic} image={props.image} size={46}/>
      <P styleType={['large', 'w600']} useThemeColor className={styles.position}>{cv.categories[0]?.name||t('cv_item_setPosition')}</P>
      <P  className={styles.refreshed}>{t('item_refreshed')} {Formatter.formatDate(cv.updatedAt, {lang: lang as InterfaceLanguage, timeOptions: {year: 'numeric'}})}</P>
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
    <div className={styles.tariffWrapper}>
      <P
      styleType={['medium', 'w500']}
      className={styles.tariff} 
      // @ts-ignore
      style={tariff.colors&&{'--gradientColor1': '#'+tariff.colors?.[0], '--gradientColor2': '#'+tariff.colors?.[1]}}
      >
        {tariff.name}
      </P>

      <P styleType={['small', 'greyLight', 'w500']}>{t('item_expires')} {Formatter.formatDate(cv.subscriptions.endAt, {lang: lang as InterfaceLanguage})}</P>
    </div>
    }


    {(props.type !== 'drafts' || !cv.completedSteps) &&
      <Statistics 
      className={styles.stats}
      title={t('item_statistics')}     
      items={[
        {name: t('item_shows'), count: cv.totalShows},
        {name: t('item_views'), count: cv.totalViews, link: `/views?cvId=${cv.id}`},
        {name: t('item_totalProposals'), count: cv.totalProposals, link: '/profile?page=feedbacks'},
      ]}
      />
      ||
      cv.completedSteps  &&
      <Progress stepsCount={6} className={styles.stats} progress={cv.completedSteps} type='cv'/>
    }

    {!props.cardMode &&    
      <div className={styles.buttonsWrapper}>
        {cv.moderationStatus !== 'approved' && props.type !== 'drafts' &&
          <p className={styles.refreshed}>{t('item_onModeration')}</p>
        }

        {cv.published && cv.moderationStatus === 'approved' && cv.subscriptions?.tariff?.price === 0 &&
          <Button
          styleType={['gradient']}
          onClick={moveToTopHandler}
          disabled={Number(cvTopTimePlusTime()) > Number(new Date())}
          >
            {cv.topAt 
            && Number(cvTopTimePlusTime()) > Number(new Date())
            &&  t('cv_item_moveToTopTime') + Formatter.formatDate(cvTopTimePlusTime(), {timeOptions: {hour: 'numeric', minute: 'numeric', month: undefined, year: undefined, day: undefined}, lang: lang as InterfaceLanguage})
              ||
              t('item_upriseInSearch')
            }
          </Button>
        }

        {(
          ((!cv.published || !cv.publishedAt) &&  cv.moderationStatus === 'approved' && props.type==='archive') 
          || 
          (props.type === 'drafts' && cv.completedSteps?.length > 6) 
        )&&
          <Button
          styleType={['gradient']}
          onClick={archiveHandler}
          >
            {t('item_publish')}
          </Button>
        }

        {cv.completedSteps?.length <=6 && props.type === 'drafts' &&
          <Button styleType={['gradient']} 
          onClick={(e)=>{
            e.preventDefault()
            e.stopPropagation()
            router.push({pathname: '/create/cv/', query: {id: cv.id, progress: cv.completedSteps.length}})}
          }>
            {t('item_continueEditing')}
          </Button>
        }

        {props.type === 'drafts' && cv.completedSteps?.length > 6 &&
          <Button styleType={['grey']} altStyleType={['whitePurple']}
          onClick={(e)=>{
            e.preventDefault()
            e.stopPropagation()
            router.push({pathname: '/create/cv/', query: {id: cv.id}})}
          }
          >{t('item_edit')}</Button>
        }

        {(cv.published || cv.publishedAt) && cv.moderationStatus === 'approved'&& props.type && 
          <Button 
          styleType={['grey']}
          altStyleType={['whitePurple']}
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
          styleType={['grey', 'purpleText']}
          altStyleType={['whitePurple']}
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