import styles from './index.module.scss'

import Button from 'components/ui/Button'
import SalaryItem from 'components/ui/SalaryItem'
import UserPic from 'components/ui/UserPic'
import { IVacancy } from 'data/interfaces/IVacancy'
import {  TranslateProposalType } from 'utils/enumsTranslations'
import Formatter from 'utils/formatter'
import classNames from 'classnames'
import ThreeDotsButton from 'components/ui/ThreeDotsButton'
import { useDetectOutsideClick } from 'components/hooks/useDetectOutsideClick'
import { useEffect, useRef, useState } from 'react'
import { useAppContext } from 'context/state'
import  { IOptionsModalProps } from 'components/modals/OptionsModal'
import { ApplicationStatus, ModalType, Preset, ProposalRequestType, SnackbarType } from 'types/enums'
import ProposalRepository from 'data/repositories/ProposalRepository'
import { IProposal } from 'data/interfaces/IProposal'
import { useRouter } from 'next/router'
import ApplicationRepository from 'data/repositories/ApplicationRepository'
import OptionsDropDown from 'components/ui/OptionsDropDown'
import { getUserImageSource } from 'utils/helpers'
import ChatRepository from 'data/repositories/ChatRepository'
import P from '@/components/ui/P'
import { IApplication } from 'data/interfaces/IApplication'
import useTranslation from 'next-translate/useTranslation'
import { ProfileType } from 'data/interfaces/IRegistration'
import CheckSvg from '@/components/svg/CheckSvg'
import { colors } from 'styles/variables'

interface Props {
  vc: IVacancy
  item?: IProposal|IApplication
  refreshCallback?: Function
  onRemove?: (id: number) => void
  status?: ApplicationStatus
}

//TODO: доделать всплывашку OptionsModal

export default function VacancyItem({vc, item, refreshCallback, onRemove, status}: Props) {  
  const appContext = useAppContext()
  const router = useRouter()
  const {isTabletWidth} = appContext.size
  const {t} = useTranslation()
  const dropRef = useRef(null!)
  const [dropDown, openDropDown] = useDetectOutsideClick(dropRef, false)
  const [chatId, setChatId] = useState<number>()


  const rejectHandler = async(deletedByEmployee?: boolean) => {
    if(!item.id) {
      appContext.showSnackbar(t('profile_wrongApplication'), SnackbarType.error)
      openDropDown(false)
      return
    }
    try{
      item.type&&
      await ProposalRepository.changeProposalStatusByEmployee(item?.id, {status: ApplicationStatus.Rejected, deletedByEmployee})
      ||
      await ApplicationRepository.patchApplicationRespond(item.id, {status: ApplicationStatus.Rejected, deletedByEmployee: deletedByEmployee})
      onRemove(item.id)
    }
    catch(err) {
      appContext.showSnackbar(t('profile_applicationNotFound'), SnackbarType.error)
    }
    openDropDown(false)
  }



  const options = (<div className={styles.options} onMouseLeave={()=>openDropDown(false)}>
    {isTabletWidth &&
      <P styleType={['greyLight', 'medium']}>{vc?.name||vc.categories[0].name}</P>
    }
    <P className={styles.option} useThemeColor onClick={(e)=>{e.stopPropagation();rejectHandler(true)}}>{t('delete')}</P>
    {(item?.status === ApplicationStatus.Accepted||item?.status === ApplicationStatus.Applied) && 
      <P className={styles.option} onClick={(e)=>{e.stopPropagation();rejectHandler()}}>{t('reject')}</P>
     }
    {isTabletWidth &&
      <P styleType={['medium', 'w500']} useThemeColor className={classNames(styles.option, styles.back)} onClick={() => appContext.hideBottomSheet()}>{t('cancelAlt')}</P>
    }
  </div>)

  const openModalHandler =(e: React.MouseEvent<Element, MouseEvent>)=> {
    e.stopPropagation()
    if (isTabletWidth) {
      appContext.showBottomSheet<IOptionsModalProps>(ModalType.OptionsModal, {children: options, itemWrapperClassName: styles.optionsWrapper}, 300)
    }
    else {
      openDropDown(!dropDown)
    }
  }

  useEffect(()=>{
    ChatRepository.getChatByContactId(item.profile.id, item?.applicationId&&{applicationId: item?.applicationId}||{proposalId: item?.id})
    .then(res => {
      setChatId(res?.id)
    })
    .catch(() => {})
  }, [])

  return (<div className={styles.root} onClick={()=>router.push(`/vacancy/${vc.id}`)}> 
    <div className={styles.top}>
      <UserPic className={styles.userPic} size={44} image={getUserImageSource(item.profile.profileType === ProfileType.Hirer?item.profile:vc?.profile, Preset.smallIconCrop)}/>
      <P styleType={['w600','large']} useThemeColor className={styles.company}>{item.profile.profileType === ProfileType.Hirer?item.profile.company: vc?.company||vc?.contactName}</P>
      {(vc?.isRemote || vc?.city) &&
        <P className={styles.city}>{vc.isRemote?t('employmentBoard_remote'): vc.city&&`${t('ruCity')} ${vc.city?.locName}`}</P>
      }
      <ThreeDotsButton onMouseEnter={openModalHandler} onClick={openModalHandler} />
      {!isTabletWidth &&
        <OptionsDropDown 
        options={options} 
        active={dropDown} 
        getRef={(r)=>dropRef.current=r} 
        onClose={()=>openDropDown(false)}/>       
      }
    </div>
    <P styleType={['large', 'w600']} useThemeColor>{vc.name}</P>
  
    <SalaryItem vacancy={vc}/>
  
    {item.status  &&
      <p className={classNames(styles.status, styles[
        (item.type === ProposalRequestType.Rejection||item.status === ApplicationStatus.Rejected) && ApplicationStatus.Rejected
        ||
        ( item.status==='applied'&& item.type === undefined) && ApplicationStatus.Applied
        ||
        (item.status==='accepted'||(item.type !== ProposalRequestType.Rejection && item.type !== undefined)) && ApplicationStatus.Accepted
      ])}
      >
        {TranslateProposalType((item.type === ProposalRequestType.Rejection||item.status === ApplicationStatus.Rejected) && ApplicationStatus.Rejected
        ||
        ( item.status==='applied'&& item.type === undefined) && ApplicationStatus.Applied
        ||
        (item.status==='accepted'||(item.type !== ProposalRequestType.Rejection && item.type !== undefined)) && ApplicationStatus.Accepted)}
      </p>
    }
    <div className={styles.bottom}>
      <p className={styles.time}>{Formatter.formatToShortYear(item.createdAt)}</p>
      {(item?.status !== ApplicationStatus.Applied || item.type !== undefined) &&
      <P styleType={['green', 'medium', 'w500', 'alignCenter']}><CheckSvg color={colors.green}/> {t('watched')}</P>
      ||
      <P styleType={['medium', 'greyLight']}>{t('unWatched')}</P>
      }
    </div>

    {((item && item.chat[0])|| chatId) &&
    <div className={styles.buttonsWrapper}>

      <Button 
      styleType={['gradient', 'phoneWide']}

      onClick={(e)=> {
        e.stopPropagation();
        (item.chat[0]||chatId)&&router.push(`/messenger?chat=${item.chat[0]?.id||chatId}`)
      }}>
        {t('goToChat')}
      </Button>
        </div>
    }
  </div>)
}