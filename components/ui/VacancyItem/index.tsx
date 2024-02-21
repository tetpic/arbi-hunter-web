import styles from './index.module.scss'

import { IVacancy } from 'data/interfaces/IVacancy'
import SalaryItem from 'components/ui/SalaryItem'
import Button from 'components/ui/Button'
import Formatter from 'utils/formatter'
import Image from 'next/image'
import { useAppContext } from 'context/state'
import { ActivityStatus, ModalType } from 'types/enums'
import { useCvContext } from 'context/cv_state'
import { IApplicationModalProps } from 'components/modals/ApplicationModal'
import LikeButton from '../LikeButton'
import VacancyRepository from 'data/repositories/VacancyRepository'
import classNames from 'classnames'
import CalendarSvg from 'components/svg/CalendarSvg'
import Link from 'next/link'
import UserPic from '../UserPic'
import useAbortController from 'components/hooks/useAbortController'
import { FILES } from 'types/constants'

interface Props {
  vacancy?: IVacancy
  onChangeItem?: () => void
  smallCard?: boolean
}

export default function VacancyItem({vacancy, onChangeItem, smallCard}: Props) {
  const appContext = useAppContext()
  const cvContext = useCvContext()
  const {getNewSignal} = useAbortController()

  const respondHandler = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    appContext.showModal<IApplicationModalProps>(ModalType.ApplicationModal, {cvs: cvContext.savedCvs, vacancyId: vacancy.id})
  }

  const likeHandler = () => {
    const[signal] = getNewSignal('likeHandler')
    if(!vacancy.isSavedByCurrentProfile) {
      VacancyRepository.addVcToSaved(vacancy.id, {signal})
      .then(_=> {
        onChangeItem&&onChangeItem()
      })
      .catch(_=>{})
    }
    else {
      VacancyRepository.removeVcFromSaved(vacancy.id, {signal})
      .then(_=> {
        onChangeItem&&onChangeItem()
      })
      .catch(_=>{})
    }
  }

  return (<Link className={styles.item} href={'/vacancy/'+vacancy.id}> 
    <LikeButton className={styles.heartButton} active={vacancy.isSavedByCurrentProfile} onClick={likeHandler}/>
   
    <div className={styles.top}>
      <div className={ styles.card}>
        {smallCard &&
        <UserPic className={styles.userPic} size={42}/>
        }
        <p className={styles.name}>{vacancy.company||vacancy.contactName}</p>
        {vacancy.city && vacancy.city.locName && !vacancy.isRemote &&
          <p className={styles.city}>г. {vacancy.city?.locName}</p>
        }
      </div>
      <p className={styles.name}>{vacancy.name}</p>
      {vacancy.isRemote &&
        <p className={styles.city}>Удаленно</p>
      }
      <SalaryItem vacancy={vacancy}/>
      <p className={styles.time}><CalendarSvg/> {Formatter.formatToShortYear(vacancy.updatedAt)}</p>
      {vacancy?.profile?.activityStatus && !smallCard &&
        <p className={styles.activityStatus}>
          <span className={classNames(styles.dot, vacancy.profile.activityStatus === ActivityStatus.Online?styles.dot_green:styles.dot_red)}></span>
          {vacancy.profile.activityStatus === ActivityStatus.Online?'В сети':`Был в сети ${Formatter.formatDateRelative(vacancy.profile.lastActivityAt)}`}
        </p>
      }
      <div className={styles.buttonsWrapper}>
        <Button 
        styleType={['gradient', 'phoneWide']}
        onClick={respondHandler}
        >
          Откликнуться
        </Button>
      </div>
    </div>
    {!smallCard &&
      <div className={(vacancy?.profile?.logo && vacancy.profile.image)?styles.buildWrapper:styles.imageWrapper}>
        {vacancy?.profile?.logo && !vacancy.profile.image &&
          <Image className={styles.image} src={FILES + vacancy?.profile?.logo?.source} alt={'def image'} width={150} height={150}/>          
          ||
          vacancy?.profile?.logo && vacancy.profile.image && 
          <>
            <Image 
            className={styles.build} 
            src={FILES + vacancy?.profile?.image.source} 
            alt='build' 
            width={256} height={300}
            />
            <Image 
            className={styles.logo} 
            src={ FILES + vacancy?.profile?.logo?.source} 
            alt={'def image'} 
            style={{top: vacancy?.profile?.image.focalPoint.y*100 + '%', left: vacancy?.profile?.image.focalPoint.x*100 + '%'}} 
            width={60} height={60}/>
          </>
          ||
          <Image className={styles.defaultImage} src={'/icons/defaultUser.svg'} alt={'def image'} width={150} height={150}/>
        }
      </div>
    }
   
  </Link>)
}