import styles from './index.module.scss'

import { IVacancy } from 'data/interfaces/IVacancy'
import SalaryItem from 'components/ui/SalaryItem'
import Button from 'components/ui/Button'
import Formatter from 'utils/formatter'
import defaultImage from 'images/recruiting/vacancyDefaultImage.png'
import Image from 'next/image'
import { useAppContext } from 'context/state'
import { ActivityStatus, ModalType } from 'types/enums'
import { useCvContext } from 'context/cv_state'
import { IApplicationModalProps } from 'components/modals/ApplicationModal'
import LikeButton from '../LikeButton'
import VacancyRepository from 'data/repositories/VacancyRepository'
import classNames from 'classnames'
import CalendarSvg from 'components/svg/CalendarSvg'

interface Props {
  vacancy?: IVacancy
  onChangeItem?: () => void
}

export default function VacancyItem({vacancy, onChangeItem}: Props) {
  const appContext = useAppContext()
  const cvContext = useCvContext()

  const respondHandler = () => {
    appContext.showModal<IApplicationModalProps>(ModalType.ApplicationModal, {cvs: cvContext.savedCvs, vacancyId: vacancy.id})
  }

  const likeHandler = () => {
    if(!vacancy.isSavedByCurrentProfile) {
      VacancyRepository.addVcToSaved(vacancy.id)
      .then(_=> {
        onChangeItem&&onChangeItem()
      })
    }
    else {
      VacancyRepository.removeVcFromSaved(vacancy.id)
      .then(_=> {
        onChangeItem&&onChangeItem()
      })
    }
  }

  return (<div className={styles.item}> 
    <LikeButton className={styles.heartButton} active={vacancy.isSavedByCurrentProfile} onClick={likeHandler}/>
    <Image className={styles.image} src={defaultImage} alt={'def image'} width={244} height={220}/>
    <div className={styles.top}>
      <div className={styles.name}>{vacancy.company}
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
      {vacancy?.profile?.activityStatus &&
        <p className={styles.activityStatus}>
          <span className={classNames(styles.dot, vacancy.profile.activityStatus === ActivityStatus.Online?styles.dot_green:styles.dot_red)}></span>
          {vacancy.profile.activityStatus === ActivityStatus.Online?'В сети':`Был в сети ${Formatter.formatDateRelative(vacancy.profile.lastActivityAt)}`}
        </p>
      }
    </div>
    <div className={styles.buttonsWrapper}>
      <Button className={styles.button} onClick={respondHandler}>Откликнуться</Button>
    </div>
  </div>)
}