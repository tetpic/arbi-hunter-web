import styles from './index.module.scss'

import { ICV } from 'data/interfaces/ICV'
import { useAppContext } from 'context/state'
import Image from 'next/image'
import SalaryItem from 'components/ui/SalaryItem'
import Formatter from 'utils/formatter'
import Button from 'components/ui/Button'
import { ActivityStatus, ApplicationBSSelectType, ApplicationStatus, ModalType, VacancyLookType } from 'types/enums'
import classNames from 'classnames'
import { IProposalModalProps, ProposalModalPager } from 'components/modals/ProposalModal'
import { IVacancy } from 'data/interfaces/IVacancy'
import { IProposalTextModalProps } from 'components/modals/ProposalModal/ProposalTextModal'
import LikeButton from '../LikeButton'
import CvRepository from 'data/repositories/CvRepository'
import Link from 'next/link'
import useAbortController from 'components/hooks/useAbortController'
import UserPic from '../UserPic'
import { getUserImageSource } from 'utils/helpers'

interface Props {
  cv: ICV
  initialVacancy?: IVacancy
  onChangeItem?: () => void
}

export default function CvItem({cv, ...props}: Props) {
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const {getNewSignal} = useAbortController()

  const defaultImage = '/icons/defaultUser.svg'
  const userImage = getUserImageSource(cv.profile)


  const respondHandler = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if(props.initialVacancy) {
      appContext.showModal<IProposalTextModalProps>
      (ModalType.ProposalTextModal, 
        {application: null, 
          type: ApplicationBSSelectType.ThisVacancy, 
          vcId: props.initialVacancy.id, 
          cv, 
          onSubmit: props.onChangeItem
        })
      return
    }
    appContext.showModal<IProposalModalProps>(
      ModalType.ProposalModal, 
      { cv, 
        page: ProposalModalPager.OtherVacancy
      }
    )
  }

  const likeHandler = () => {
    const [signal] = getNewSignal('likeHandler')
    if(!cv.isSavedByCurrentProfile) {
      CvRepository.addCvToSaved(cv.id, {signal})
      .then(res=> {
        props.onChangeItem()      
      })
      .catch(_=>{})
    }
    else {
      CvRepository.removeCvFromSaved(cv.id, {signal})
      .then(_=> {
        props.onChangeItem()
      })
      .catch(_=>{})
    }
  }

  return (<Link className={styles.item} href={'cv/'+cv.id}> 
    <LikeButton  className={styles.heartButton} active={cv.isSavedByCurrentProfile} onClick={likeHandler}/>
    <Image 
    className={cv.profile?.useOwnLogo?styles.logo:styles.image} 
    src={userImage||defaultImage} 
    alt={'def image'} width={320} height={320} 
    />

    <div className={styles.content}>
      <div className={styles.top}>
        {isTabletWidth && !cv.profile?.useOwnLogo &&
          <UserPic className={styles.userPic} image={userImage} size={60}/>
        }
        {cv.categories.length > 0 &&
          <p className={styles.name}>{cv.categories[0].name}</p>
        }
        <p className={styles.sub}>{cv.profile?.firstName} {cv.profile?.lastName} {cv.age&&cv.age +' '+ Formatter.pluralize(cv.age, 'год', 'года', 'лет')} </p>
      </div>

      {cv.city && cv.city.locName && !cv.isRemote &&
        <p className={styles.sub}>г. {cv.city?.locName}</p>
      }
      {cv.isRemote &&
        <p className={styles.sub}>Удаленно</p>
      }
      <SalaryItem cv={cv}/>
      {cv?.profile?.activityStatus &&
        <p className={styles.activityStatus}>
          <span className={classNames(styles.dot, cv.profile.activityStatus === ActivityStatus.Online?styles.dot_green:styles.dot_red)}></span>
          {cv.profile.activityStatus === ActivityStatus.Online?'В сети':`Был в сети ${Formatter.formatDateRelative(cv.profile.lastActivityAt)}`}
        </p>
      }
      {cv.vacancyLookType &&
      <p className={classNames(styles.lookType, cv.vacancyLookType === VacancyLookType.NotLooking?styles.lookType_red:styles.lookType_green)}>
        {cv.vacancyLookType === VacancyLookType.NotLooking?'Не ищет работу': 'В активном поиске'}
      </p>
      }
      {cv.experienceInfo && cv.experienceInfo.length > 0 &&
        <p className={styles.sub}>Опыт работы <span className={styles.sub_white}>{Formatter.fullTimeLine(cv.experienceInfo?.map(el=> [el.fromDate, el.toDate]))}</span></p>
      }
      {cv.lastExperienceInfo &&
      <p className={styles.sub}>Последнее место работы <span className={styles.sub_white}>{cv.lastExperienceInfo.company}</span></p>
      }
    </div>
    <div className={styles.buttonsWrapper}>
      {(!cv.proposalByCurrentUser || cv.proposalByCurrentUser.status === ApplicationStatus.Rejected || cv.proposalByCurrentUser.vacancyId !== props.initialVacancy?.id) &&
      <Button className={styles.button} onClick={respondHandler}>Пригласить</Button>
      ||
      <Button className={styles.buttonDisabled}>Приглашение выслано</Button>
      }
    </div>
  </Link>)
}