import styles from './index.module.scss'

import { ICV } from 'data/interfaces/ICV'
import { useAppContext } from 'context/state'
import Image from 'next/image'
import Formatter from 'utils/formatter'
import Button from 'components/ui/Button'
import { ApplicationBSSelectType,  ApplicationStatus,  ModalType, VacancyLookType } from 'types/enums'
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
  const [isOpenContacts, setIsOpenContacts] = useState<boolean>(cv.isContactsOpen)
  const [isLoading, setIsLoading] = useState<boolean>(false)


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
  
  const openContacts = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLoading(true)
    CvRepository.openContacts(cv.id)
    .then(res=> {
      setIsOpenContacts(true)
      setIsLoading(false)
    })
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
    <Image 
    className={cv.profile?.useOwnLogo?styles.logo:styles.image} 
    src={userImage||defaultImage} 
    alt={'def image'} width={320} height={320} 
    />

    <div className={styles.content}>
      <CvItemTop cv={cv} userImage={userImage}/>

      {cv.vacancyLookType &&
        <p className={classNames(styles.lookType, cv.vacancyLookType === VacancyLookType.NotLooking?styles.lookType_red:styles.lookType_green)}>
          {cv.vacancyLookType === VacancyLookType.NotLooking?'Не ищет работу': 'Активно ищет работу'}
        </p>
      }

      {isOpenContacts &&
        <P styleType={['w500', 'medium']}>{getUserName(cv.profile)}</P>
      }

      {cv.isRemote &&
        <P styleType={['medium', 'w500', 'greyLight']} className={styles.sub}>
          Удаленно
        </P>
      }

      <P styleType={['alignCenter', 'w500']}>
        {[getSalary({cv}), getAge(cv.age), cv.city?.locName].filter(Boolean).map((el, index, arr)=>{
          return (
            <>{el} {index < arr.length - 1 && <DotSvg/>}</>
          )
        })}
      </P>

      {cv.experienceInfo && cv.experienceInfo.length > 0 &&
        <div className={styles.item__block}>
          <P styleType={['small', 'greyLight']}>
            Опыт работы 
          </P>
          <P styleType={['medium', 'w500']}>{Formatter.fullTimeLine(cv.experienceInfo?.map(el=> [el.fromDate, el.toDate]))}</P>
        </div>
      }

      {cv.lastExperienceInfo &&
      <div className={styles.item__block}>
        <P styleType={['small', 'greyLight']}>
          Последнее место работы 
        </P>
        <P styleType={['medium', 'w500']}>{cv.lastExperienceInfo.company}</P>
      </div>
      }
    </div>
    <div className={styles.buttonsWrapper}>
      {!isOpenContacts &&
        <Button styleType={['gradient', 'wide']} disabled={isLoading} isProcess={isLoading} onClick={openContacts}>Открыть профиль</Button>
      }
      {
        cv.proposalsByCurrentUser.length === 0 && isOpenContacts &&
        <Button styleType={['gradient', 'wide']}  onClick={respondHandler}>Пригласить</Button>
        ||
        isOpenContacts &&
        <Button styleType={['gradient', 'phoneWide']}  onClick={openChat}>Чат</Button>
      }
      {isOpenContacts && 
        <Button styleType={['borderBlue', 'black', 'wide']}>Контакты</Button>
      }
      {(cv.applicationsToCurrentUser.length > 0 || cv.proposalsByCurrentUser.length > 0) &&
        <Button styleType={['icon', 'black']}><FolderPlusSvg/></Button>
      }
    </div>
  </Link>)
}