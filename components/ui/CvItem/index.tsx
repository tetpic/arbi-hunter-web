import styles from './index.module.scss'

import { ICV } from 'data/interfaces/ICV'
import { useAppContext } from 'context/state'
import Image from 'next/image'
import SalaryItem from 'components/ui/SalaryItem'
import Formatter from 'utils/formatter'
import Button from 'components/ui/Button'
import { ActivityStatus, ApplicationBSSelectType,  ApplicationStatus,  ModalType, VacancyLookType } from 'types/enums'
import classNames from 'classnames'
import { IProposalModalProps, ProposalModalPager } from 'components/modals/ProposalModal'
import { IVacancy } from 'data/interfaces/IVacancy'
import { IProposalTextModalProps } from 'components/modals/ProposalModal/ProposalTextModal'
import LikeButton from '../LikeButton'
import CvRepository from 'data/repositories/CvRepository'
import Link from 'next/link'
import useAbortController from 'components/hooks/useAbortController'
import { getUserImageSource } from 'utils/helpers'
import CvItemTop from './CvItemTop'
import P from '../P'
import { useVacancyContext } from 'context/vacancy_state'
import ChatRepository from 'data/repositories/ChatRepository'
import { useRouter } from 'next/router'
import FolderPlusSvg from '@/components/svg/FolderPlusSvg'

interface Props {
  cv: ICV
  initialVacancy?: IVacancy
  onChangeItem?: () => void
}

export default function CvItem({cv, ...props}: Props) {
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const {getNewSignal} = useAbortController()
  const vacancyContext = useVacancyContext()

  const defaultImage = '/icons/defaultUser.svg'
  const userImage = getUserImageSource(cv.profile)
  const router = useRouter()


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
        page: ProposalModalPager.OtherVacancy,
        activeVacancies: [...vacancyContext.activeVacancies.values()],
      }
    )
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
    <LikeButton className={styles.heartButton} active={cv.isSavedByCurrentProfile} onClick={likeHandler}/>
    <Image 
    className={cv.profile?.useOwnLogo?styles.logo:styles.image} 
    src={userImage||defaultImage} 
    alt={'def image'} width={320} height={320} 
    />

    <div className={styles.content}>
      <CvItemTop cv={cv} userImage={userImage}/>

      {cv.city && cv.city.locName && !cv.isRemote &&
        <P styleType={['medium', 'w500', 'greyLight']} className={styles.sub}>г. {cv.city?.locName}</P>
      }
      {cv.isRemote &&
        <P styleType={['medium', 'w500', 'greyLight']} className={styles.sub}>Удаленно</P>
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
        <P className={styles.sub}>Опыт работы <span className={styles.sub_white}>{Formatter.fullTimeLine(cv.experienceInfo?.map(el=> [el.fromDate, el.toDate]))}</span></P>
      }
      {cv.lastExperienceInfo &&
      <p className={styles.sub}>Последнее место работы <span className={styles.sub_white}>{cv.lastExperienceInfo.company}</span></p>
      }
    </div>
    <div className={styles.buttonsWrapper}>
      
      {(cv.proposalsByCurrentUser.length === 0) &&
      <Button styleType={['gradient', 'wide']}  onClick={respondHandler}>Пригласить</Button>
      ||
      <Button styleType={['gradient', 'phoneWide']}  onClick={openChat}>Чат</Button>
      }
      {cv.isContactsOpen && 
        <Button styleType={['borderBlue', 'black', 'wide']}>Контакты</Button>
      }
      {(cv.applicationsToCurrentUser.length > 0 || cv.proposalsByCurrentUser.length > 0) &&
        <Button styleType={['icon', 'black']}><FolderPlusSvg/></Button>
      }
 
    </div>
  </Link>)
}