import styles from './index.module.scss'

import Button from 'components/ui/Button'
// import FavoritesButton from 'components/ui/FavoritesButton'
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
import { ApplicationStatus, ModalType } from 'types/enums'
import { useUserContext } from 'context/user_state'
import ProposalRepository from 'data/repositories/ProposalRepository'
import { IProposal } from 'data/interfaces/IProposal'

interface Props {
  vc: IVacancy
  proposal?: IProposal
  refreshCallback?: Function
}

export default function VacancyItem({vc, proposal, refreshCallback}: Props) {
  const appContext = useAppContext()
  const userContext = useUserContext()
  const {isTabletWidth} = useResize()
  const dropRef = useRef(null!)
  const [dropDown, openDropDown] = useDetectOutsideClick(dropRef, false)

  const rejectHandler = () => {
    ProposalRepository.changeProposalStatusByEmployee(userContext.currentProfile.profileType, proposal.application?.id, ApplicationStatus.Rejected)
    openDropDown(false)
  }

  const options = (<div className={styles.options}>
    <p className={styles.vacancyName}>{vc.name}</p>
    <p className={styles.option}>Удалить</p>
    <p className={styles.option} onClick={rejectHandler}>Отказаться</p>
    {isTabletWidth &&
      <p className={styles.option}>Отмена</p>
    }
  </div>)

const openModalHandler =()=> {
  if (isTabletWidth) {
    appContext.showBottomSheet<ICvVcOptionsModalProps>(ModalType.CvVcOptionsModal, {vc: vc, children: options})
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
    <Button className={styles.button}>Перейти в чат</Button>
    ||
    <Button className={styles.button}>Откликнуться</Button>
    }
  </div>
  </div>)
}