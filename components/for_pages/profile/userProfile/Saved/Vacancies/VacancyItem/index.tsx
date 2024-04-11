import styles from './index.module.scss'

import Button from 'components/ui/Button'
import SalaryItem from 'components/ui/SalaryItem'
import UserPic from 'components/ui/UserPic'
import { IVacancy } from 'data/interfaces/IVacancy'
import { TranslateProposalRequestType, TranslateProposalType } from 'utils/enumsTranslations'
import Formatter from 'utils/formatter'
import classNames from 'classnames'
import ThreeDotsButton from 'components/ui/ThreeDotsButton'
import { useDetectOutsideClick } from 'components/hooks/useDetectOutsideClick'
import { useRef } from 'react'
import { useResize } from 'components/hooks/useResize'
import { useAppContext } from 'context/state'
import  { IOptionsModalProps } from 'components/modals/OptionsModal'
import { ApplicationStatus, ModalType, Preset, ProposalRequestType, SnackbarType } from 'types/enums'
import ProposalRepository from 'data/repositories/ProposalRepository'
import { IProposal } from 'data/interfaces/IProposal'
import { useRouter } from 'next/router'
import ApplicationRepository from 'data/repositories/ApplicationRepository'
import OptionsDropDown from 'components/ui/OptionsDropDown'
import { getUserImageSource } from 'utils/helpers'

interface Props {
  vc: IVacancy
  proposal?: IProposal
  refreshCallback?: Function
  onRemove?: (id: number) => void
}

//TODO: доделать всплывашку OptionsModal

export default function VacancyItem({vc, proposal, refreshCallback, onRemove}: Props) {
  const appContext = useAppContext()
  const router = useRouter()
  const {isTabletWidth} = useResize()
  const dropRef = useRef(null!)
  const [dropDown, openDropDown] = useDetectOutsideClick(dropRef, false)

  const rejectHandler = async(deletedByEmployee?: boolean) => {
    if(!proposal.id) {
      appContext.showSnackbar('Отклик некорректен. Действия невозможны', SnackbarType.error)
      openDropDown(false)
      return
    }
    try{
      proposal.type&&
      await ProposalRepository.changeProposalStatusByEmployee(proposal?.id, {status: ApplicationStatus.Rejected, deletedByEmployee})
      ||
      await ApplicationRepository.patchApplicationRespond(proposal.id, {status: ApplicationStatus.Rejected, deletedByEmployee: deletedByEmployee})
      onRemove(proposal.id)
    }
    catch(err) {
      appContext.showSnackbar('Приглашение не найдено', SnackbarType.error)
    }
    openDropDown(false)
  }

  const options = (<div className={styles.options} onMouseLeave={()=>openDropDown(false)}>
    <p className={styles.option} onClick={(e)=>{e.stopPropagation();rejectHandler(true)}}>Удалить</p>
    {(proposal?.status === ApplicationStatus.Accepted||proposal.type === ProposalRequestType.Interview) && 
      <p className={styles.option} onClick={(e)=>{e.stopPropagation();rejectHandler()}}>Отказаться</p>
    }
    {isTabletWidth &&
      <p className={classNames(styles.option, styles.back)}>Отмена</p>
    }
  </div>)



  const openModalHandler =()=> {
    if (isTabletWidth) {
      appContext.showBottomSheet<IOptionsModalProps>(ModalType.OptionsModal, null, 200)
    }
    else {
      openDropDown(!dropDown)
    }
  }

  return (<div className={styles.root}> 
    <div className={styles.top}>
      <UserPic className={styles.userPic} size={44} image={getUserImageSource(vc.profile, Preset.smallIconCrop)}/>
      <p className={styles.company}>{vc.company||vc.contactName}</p>

      <p className={styles.city}>{vc.isRemote?'Удаленно': vc.city&&`г. ${vc.city?.locName}`}</p>
      <ThreeDotsButton onMouseEnter={openModalHandler} className={styles.heartButton}/>
      {!isTabletWidth &&
        <OptionsDropDown 
        options={options} 
        active={dropDown} 
        getRef={(r)=>dropRef.current=r} 
        onClose={()=>openDropDown(false)}/>       
      }

    </div>
    <p className={styles.vcName}>{vc.name}</p>
  
    <SalaryItem vacancy={vc}/>
  
    {proposal &&
     <p className={classNames(styles.status, styles[
       proposal.notification&&proposal.status!==ApplicationStatus.Rejected?proposal.type:proposal.status    ])}>
       {proposal.notification&&proposal.status!==ApplicationStatus.Rejected?TranslateProposalRequestType(proposal.type):TranslateProposalType(proposal.status)}
       </p>
    }
    <div className={styles.bottom}>
      <p className={styles.time}>{Formatter.formatToShortYear(vc.updatedAt)}</p>
      {proposal &&
      <Button className={styles.button} onClick={()=> {proposal?.chat[0]&&router.push(`/messenger?chat=${proposal.chat[0].id}`)}}>Перейти в чат</Button>
      ||
      <Button className={styles.button}>Откликнуться</Button>
      }
    </div>
  </div>)
}