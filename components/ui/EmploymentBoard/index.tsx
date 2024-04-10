import { ICV } from 'data/interfaces/ICV'
import styles from './index.module.scss'
import { IVacancy } from 'data/interfaces/IVacancy'
import { TranslateEmploymentType, TranslateScheduleType } from 'utils/enumsTranslations'
import P from '../P'
import { ScheduleType } from 'types/enums'
import classNames from 'classnames'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  type?: 'black'|'gradient'
  cv?: ICV, 
  vacancy?: IVacancy
}

export default function EmploymentBoard({type,cv,vacancy}: Props) {
  const {t} = useTranslation()
  return (        
  <div className={classNames(styles.badges, type&&styles[type])} data-cy='employment_board'>
    <div className={styles.badge}>
      <P styleType={['medium', 'w500']}>{t('employmentBoard_employment')}</P>
      <P styleType={['medium', 'w500']}>{TranslateEmploymentType(cv?.employment||vacancy?.employment, t)}</P>
    </div>
    <div className={styles.divider}></div>
    <div className={styles.badge}>
      <P styleType={['medium', 'w500']}>{t('employmentBoard_schedule')}</P>
      <P styleType={['medium', 'w500']}>{TranslateScheduleType(cv?.schedule||vacancy?.schedule, t)}</P>
    </div>
    <div className={styles.divider}></div>
    <div className={styles.badge}>
      <P styleType={['medium', 'w500']}>{t('employmentBoard_place')}</P>
      <P styleType={['medium', 'w500']}>
        {
          (cv&&(cv?.schedule === ScheduleType.Remote?t('employmentBoard_remote'): cv?.city?.locName||t('employmentBoard_office')))
          ||
          (vacancy &&(vacancy.isRemote?t('employmentBoard_remote'): t('employmentBoard_office')))
        }
      </P>
    </div>
  </div>
)
}