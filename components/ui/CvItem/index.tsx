import styles from './index.module.scss'

import { ICV } from 'data/interfaces/ICV'
import { useAppContext } from 'context/state'
import Image from 'next/image'
import Formatter from 'utils/formatter'
import Button from 'components/ui/Button'
import { AppTheme, ApplicationBSSelectType,  ApplicationStatus,  ModalType, Preset, ProposalRequestType} from 'types/enums'
import classNames from 'classnames'
import { IProposalModalProps, ProposalModalPager } from 'components/modals/ProposalModal'
import { IVacancy } from 'data/interfaces/IVacancy'
import { IProposalTextModalProps } from 'components/modals/ProposalModal/ProposalTextModal'
import CvRepository from 'data/repositories/CvRepository'
import Link from 'next/link'
import useAbortController from 'components/hooks/useAbortController'
import { getAge, getSalary, getUserImageSource, getUserName } from 'utils/helpers'
import CvItemTop from './CvItemTop'
import P from '../P'
import { useVacancyContext } from 'context/vacancy_state'
import ChatRepository from 'data/repositories/ChatRepository'
import { useRouter } from 'next/router'
import FolderPlusSvg from '@/components/svg/FolderPlusSvg'
import DotSvg from '@/components/svg/DotSvg'
import { useState } from 'react'
import { TranslateVacancyLookType } from 'utils/enumsTranslations'
import { ProfileType } from 'data/interfaces/IRegistration'
import useTranslation from 'next-translate/useTranslation'
import FavoritesButton from '../FavoritesButton'
import { useUserContext } from 'context/user_state'
import { useFavoritesFolderContext } from 'context/favorites_folder_state'
import { ChooseFolderToSaveArgs } from '@/components/modals/ChooseFolderToSave'
import { IProposal } from 'data/interfaces/IProposal'
import { IApplication } from 'data/interfaces/IApplication'

interface Props {
  cv: ICV
  initialVacancy?: IVacancy
  onChangeItem?: () => void
}

export default function CvItem({cv, ...props}: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const {getNewSignal} = useAbortController()
  const vacancyContext = useVacancyContext()
  const userContext = useUserContext()
  const folderContext = useFavoritesFolderContext()

  const defaultImage = '/icons/defaultUser.svg'
  const userImage = getUserImageSource(cv.profile, Preset.sCrop)
  const router = useRouter()
  const [isOpenContacts, setIsOpenContacts] = useState<boolean>(cv.isContactsOpen)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {isTabletWidth} = appContext.size
  const isLightTheme = appContext.theme === AppTheme.Light


  const respondHandler = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if(props.initialVacancy) {
      const args:IProposalTextModalProps = {application: null, 
        type: ApplicationBSSelectType.ThisVacancy, 
        vcId: props.initialVacancy.id, 
        cv, 
        onSubmit: props.onChangeItem
      }
      isTabletWidth
      ? appContext.showBottomSheet<IProposalTextModalProps>(ModalType.ProposalTextModal, args)
      :appContext.showModal<IProposalTextModalProps>(ModalType.ProposalTextModal, args)
      return
    }
    const args = { cv, 
      page: ProposalModalPager.OtherVacancy,
      activeVacancies: [...vacancyContext.activeVacancies.values()],
    }
    isTabletWidth
    ?appContext.showBottomSheet<IProposalModalProps>(ModalType.ProposalModal, args)
    :appContext.showModal<IProposalModalProps>(ModalType.ProposalModal, args)
  }

  const openChat = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const activeChat = cv.proposalsByCurrentUser.filter(el => el.status === ApplicationStatus.Accepted||el.status === ApplicationStatus.Applied)
    if(activeChat[0]){
      ChatRepository.getChatByContactId(cv.profile.id, {proposalId: activeChat[0].id})
      .then(res=>{
        if(res) {
          router.push('/messenger?chat=' + res.id)
        }
      })
    }
  }
  
  const openContacts = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLoading(true)
    CvRepository.openContacts(cv.id)
    .then(res=> {
      setIsOpenContacts(true)
      setIsLoading(false)
    })
    .catch(err => {
      isTabletWidth
      ?appContext.showBottomSheet(ModalType.BuyOpensModal, null, 280)
      :appContext.showModal(ModalType.BuyOpensModal)
      setIsLoading(false)
    })
  }


  const addToSaved = (signal: AbortSignal, folderId?: number ) => {
    CvRepository.addCvToSaved({id: cv.id, favouriteFolderId: folderId}, {signal})
    .then(res=> {
      props.onChangeItem()      
    })
    .catch(_=>{})
  }

  const removeFromSaved = (signal: AbortSignal) => {
    CvRepository.removeCvFromSaved(cv.id, {signal})
    .then(_=> {
      props.onChangeItem()
    })
    .catch(_=>{})
  }

  const showFolderModal = (signal: AbortSignal) =>{
    const _args:ChooseFolderToSaveArgs = {
      initialFolders: folderContext.allFolders,
      onChoose: (folderId) => {
        addToSaved(signal, folderId)
      }
    }
    isTabletWidth
    ?appContext.showBottomSheet<ChooseFolderToSaveArgs>(ModalType.ChooseFolderToSave, _args)
    :appContext.showModal<ChooseFolderToSaveArgs>(ModalType.ChooseFolderToSave, _args)
  }

  const likeHandler = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()
    const [signal] = getNewSignal('likeHandler')
    if(!cv.isSavedByCurrentProfile) {
      userContext.currentProfile.addSavedToDefaultFolder?addToSaved(signal):showFolderModal(signal)
    }
    else {
      removeFromSaved(signal)
    }
  }


  const rejectionHandler = () => {
    const _args: IProposalTextModalProps = {
      type: ApplicationBSSelectType.Reject, 
      application: cv.applicationsToCurrentUser[0]?({...cv.applicationsToCurrentUser?.[0], proposals: []} as IApplication):({...cv.proposalsByCurrentUser?.[0], proposals: []} as IApplication), 
      cv: cv, 
      vcId: cv.applicationsToCurrentUser?.[0]?.vacancyId||cv.proposalsByCurrentUser?.[0]?.vacancyId,
      onSubmit: (type?: ProposalRequestType, text?: string, proposal?: IProposal) => {          
        debugger
        // dialog.refreshMessage(Number(cv.message.id), {...props.message, proposal: {...props.application, ...proposal}})
      }
    }
    appContext.showModal<IProposalTextModalProps>(ModalType.ProposalTextModal, _args)
    
  }


  return (<Link 
  className={classNames(styles.item, isLightTheme && styles.item_light, cv.subscriptions?.tariff?.key.includes('Vip')&&styles.VIP)} 
  //@ts-ignore
  style={{'--gradientColor1': '#'+cv.subscriptions?.tariff?.colors[0]+'50', '--gradientColor2':'#'+cv.subscriptions?.tariff?.colors[1]+'50'}}
  href={'cv/'+cv.id}> 
    <FavoritesButton className={styles.favoriteButton} showStar onClick={likeHandler} isActive={cv.isSavedByCurrentProfile}/>
    {userImage && !isTabletWidth &&
      <Image 
      unoptimized
      className={cv.profile?.useOwnLogo?styles.logo:styles.image} 
      src={userImage} 
      alt={'def image'} width={320} height={320} 
      />
      // ||
      // <Image 
      // className={cv.profile?.useOwnLogo?styles.logo:styles.image} 
      // src={defaultImage} 
      // alt={'def image'} width={320} height={320} 
      // />
    }

    <div className={styles.content}>
      <CvItemTop cv={cv} userImage={userImage}/>

      {cv.vacancyLookType &&
        <p className={classNames(styles.lookType, styles[cv.vacancyLookType])}>
          {TranslateVacancyLookType(cv.vacancyLookType, ProfileType.Hirer, t)}
        </p>
      }

      {isOpenContacts &&
        <P styleType={['w500', 'medium']} useThemeColor>{getUserName(cv.profile)}</P>
      }

      {cv.isRemote &&
        <P styleType={['medium', 'w500', 'greyLight']} useThemeColor className={styles.sub}>
          {t('cv_item_remote')}
        </P>
      }

      <P styleType={['alignCenter', 'w500', 'medium']} useThemeColor className={styles.info}>
        {[getSalary({cv}, t), getAge(cv.age), cv.city?.locName].filter(Boolean).map((el, index, arr)=>{
          return (
            <>{el} {index < arr.length - 1 && <DotSvg/>}</>
          )
        })}
      </P>

      {cv.experienceInfo && cv.experienceInfo.length > 0 &&
        <div className={styles.item__block}>
          <P styleType={['small', 'greyLight']}>
            {t('cv_item_experience')} 
          </P>
          <P styleType={['medium', 'w500']} useThemeColor>
            {Formatter.fullTimeLine(cv.experienceInfo?.map(el=> [el.fromDate, el.toDate]))}
          </P>
        </div>
      }

      {cv.lastExperienceInfo &&
      <div className={styles.item__block}>
        <P styleType={['small', 'greyLight']}>
          {t('cv_item_lastWorkPlace')} 
        </P>
        <P styleType={['medium', 'w500']}>{cv.lastExperienceInfo.company}</P>
      </div>
      }
    </div>
    <div className={styles.buttonsWrapper}>
      {!isOpenContacts &&
        <Button styleType={['gradient', 'wide']} disabled={isLoading} isProcess={isLoading} onClick={openContacts}>
          {t('cv_item_openProfile')}
        </Button>
      }
      {
        cv.proposalsByCurrentUser.length === 0 && isOpenContacts &&
        <Button styleType={['gradient', 'wide']}  onClick={respondHandler}>{t('cv_item_invite')}</Button>
        ||
        isOpenContacts &&
        <Button styleType={['gradient', 'phoneWide']}  onClick={openChat}>{t('cv_item_chat')}</Button>
      }
      {isOpenContacts && 
        <Button styleType={['borderBlue', 'black', 'wide','backTransparent']} altStyleType={['borderBlue', 'white' ,'wide']} ><P altStyleType={['blue']}>{t('cv_item_contacts')}</P></Button>
      }
      {(cv.applicationsToCurrentUser.length > 0 || cv.proposalsByCurrentUser.length > 0) &&
        <Button 
        styleType={['icon', 'black']} 
        altStyleType={['borderBlue', 'white', 'icon' ]}
        onClick={(e)=> {
          e.preventDefault()
          e.stopPropagation()
          rejectionHandler()
        }}
        >
          <FolderPlusSvg/>
        </Button>
      }
    </div>
  </Link>)
}