import styles from './index.module.scss'

import Button from 'components/ui/Button'
import SalaryItem from 'components/ui/SalaryItem'
import UserPic from 'components/ui/UserPic'
import { IVacancy } from 'data/interfaces/IVacancy'
import { TranslateProposalType } from 'utils/enumsTranslations'
import Formatter from 'utils/formatter'
import classNames from 'classnames'
import ThreeDotsButton from 'components/ui/ThreeDotsButton'
import { useDetectOutsideClick } from 'components/hooks/useDetectOutsideClick'
import { useRef } from 'react'
import { useResize } from 'components/hooks/useResize'
import { useAppContext } from 'context/state'
import CvVcOptionsModal, { ICvVcOptionsModalProps } from 'components/modals/OptionsModal'
import { ApplicationStatus, ModalType, SnackbarType } from 'types/enums'
import { useUserContext } from 'context/user_state'
import ProposalRepository from 'data/repositories/ProposalRepository'
import { IProposal } from 'data/interfaces/IProposal'
import { useRouter } from 'next/router'

interface Props {
  vc: IVacancy
  proposal?: IProposal
  refreshCallback?: Function
  onRemove?: Function
}

export default function VacancyItem({vc, proposal, refreshCallback, onRemove}: Props) {
  const appContext = useAppContext()
  const userContext = useUserContext()
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
    await ProposalRepository.changeProposalStatusByEmployee(userContext.currentProfile.profileType, proposal?.id, {status: ApplicationStatus.Rejected, deletedByEmployee})
    onRemove()
    openDropDown(false)
  }

  const options = (<div className={styles.options}>
    <p className={styles.vacancyName}>{vc.name}</p>
    <p className={styles.option} onClick={(e)=>{e.stopPropagation();rejectHandler(true)}}>Удалить</p>
    {proposal.status === ApplicationStatus.Accepted &&
      <p className={styles.option} onClick={(e)=>{e.stopPropagation();rejectHandler()}}>Отказаться</p>
    }
    {isTabletWidth &&
      <p className={classNames(styles.option, styles.back)}>Отмена</p>
    }
  </div>)

const openModalHandler =()=> {
  if (isTabletWidth) {
    appContext.showBottomSheet<ICvVcOptionsModalProps>(ModalType.CvVcOptionsModal, {vc: vc, children: options}, 250)
  }
  else {
    openDropDown(!dropDown)
  }
}

  return (<div className={styles.root}> 
  <div className={styles.top}>
    <UserPic className={styles.userPic} size={44}/>
    <p className={styles.company}>{vc.company}</p>
    <p className={styles.city}>г. {vc.city?.locName}</p>
    <ThreeDotsButton onClick={openModalHandler} className={styles.heartButton}/>
    <div ref={dropRef} className={classNames(styles.modalWrapper, dropDown&&styles.modalWrapper_active)}>
      <CvVcOptionsModal onClose={()=>openDropDown(false)} outerData={{vc: vc}} >
        {options}
      </CvVcOptionsModal>
    </div>
  </div>
  <p className={styles.vcName}>{vc.name}</p>
  
  <SalaryItem vacancy={vc}/>
  
   {proposal &&
    <p className={classNames(styles.status, styles[proposal.status])}>{TranslateProposalType(proposal.status)}</p>
   }
  <div className={styles.bottom}>
    <p className={styles.time}>{Formatter.formatToShortYear(vc.updatedAt)}</p>
    {proposal &&
    <Button className={styles.button} onClick={()=> {proposal.chat[0]&&router.push(`/messenger?chat=${proposal.chat[0].id}`)}}>Перейти в чат</Button>
    ||
    <Button className={styles.button}>Откликнуться</Button>
    }
  </div>
  </div>)
}