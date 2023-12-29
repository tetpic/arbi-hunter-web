import styles from './index.module.scss'

import { ICV } from 'data/interfaces/ICV'
import Title from '../TitleForSection'
import { IVacancy } from 'data/interfaces/IVacancy'
import Button from '../Button'
import classNames from 'classnames'
import ShareSvg from 'components/svg/ShareSvg'
import HeartSvg from 'components/svg/HeartSvg'
import CloseEyeSvg from 'components/svg/CloseEyeSvg'
import SalaryItem from '../SalaryItem'
import CvRepository from 'data/repositories/CvRepository'
import VacancyRepository from 'data/repositories/VacancyRepository'
import { useRef, useState } from 'react'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'

interface Props {
  title: string
  city?: string
  cv?: ICV
  vc?: IVacancy
  buttonText: string
  onButtonClick?: ()=>void
  hideButtons?: boolean
}

export default function CvVcPageTop(props: Props) {
  const liked = useRef(props.cv?props.cv.isSavedByCurrentProfile:props.vc.isSavedByCurrentProfile)
  const [isLiked, setIsLiked] = useState<boolean>(liked.current)
  const userContext = useUserContext()


  const likeItem = ()=>{
    if(props.cv) {
      liked.current === false &&
      CvRepository.addCvToSaved(props.cv.id)
      .then(_=> {
        setIsLiked(true)
        liked.current = true
      })
      liked.current === true &&
      CvRepository.removeCvFromSaved(props.cv.id)
      .then(_=> {
        setIsLiked(false)
        liked.current = false
      })
    }
    else {
      liked.current === false &&
      VacancyRepository.addVcToSaved(props.vc.id)
      .then(_=> {
        setIsLiked(true)
        liked.current = true
      })
      liked.current === true &&
      VacancyRepository.removeVcFromSaved(props.vc.id)
      .then(_=> {
        setIsLiked(false)
        liked.current = false
      })      
    }
  }

  return (<div className={styles.top}>
    <div className={styles.left}>
      <Title title={props.title}/>
      {props.city && 
        <p className={styles.city}>г. {props.city}</p>
      }
      <SalaryItem cv={props.cv} vacancy={props.vc} />
    </div>
    {((userContext?.currentProfile?.profileType === ProfileType.Hirer && props.cv) 
    ||
    (userContext?.currentProfile?.profileType === ProfileType.Employee && props.vc && !props.hideButtons))
    &&
    <div className={styles.right}>
      <Button className={classNames(styles.button, styles.share)}><ShareSvg/></Button>
      <Button 
      onClick={()=>likeItem()} 
      className={classNames(styles.button, styles.heart, isLiked&&styles.heart_full)}
      >
        <HeartSvg/>
      </Button>
      <Button className={classNames(styles.button, styles.closeEye)}><CloseEyeSvg/></Button>
      <Button onClick={()=>props.onButtonClick()} className={styles.showContacts}>{props.buttonText}</Button>
    </div>
      }
  </div>)
}