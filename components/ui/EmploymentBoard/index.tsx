import { ICV } from 'data/interfaces/ICV'
import styles from './index.module.scss'
import { IVacancy } from 'data/interfaces/IVacancy'
import { TranslateEmploymentType, TranslateScheduleType } from 'utils/enumsTranslations'
import P from '../P'

interface Props {
}

export default function EmploymentBoard(props: {cv?: ICV, vacancy?: IVacancy}) {
  return (        
  <div className={styles.badges}>
    <div className={styles.badge}>
      <P styleType={['medium', 'w500']}>Занятость</P>
      <P styleType={['medium', 'w500']}>{TranslateEmploymentType(props.cv.employment||props.vacancy.employment)}</P>
    </div>
    <div className={styles.divider}></div>
    <div className={styles.badge}>
      <P styleType={['medium', 'w500']}>График работы</P>
      <P styleType={['medium', 'w500']}>{TranslateScheduleType(props.cv.schedule||props.vacancy.schedule)}</P>
    </div>
    <div className={styles.divider}></div>
    <div className={styles.badge}>
      <P styleType={['medium', 'w500']}>Место</P>
      <P styleType={['medium', 'w500']}>{(props.cv&&(props.cv.isRemote?'Удаленно': props.cv.city.locName))||(props.vacancy &&(props.vacancy.isRemote?'Удаленно': props.vacancy.city.locName))}</P>
    </div>
  </div>
)
}