import RadioListField from 'components/fields/RadioListField'
import { EmploymentType, ScheduleType } from 'types/enums'
import styles from './index.module.scss'
import WorkPlace from '../WorkPlace'
import SectionSubtitle from '../../SectionSubtitle'
import { TranslateEmploymentType, TranslateScheduleType } from 'utils/enumsTranslations'
import useTranslation from 'next-translate/useTranslation'

interface Props {
}

export default function Busyness(props: Props) {
  const {t} = useTranslation()

  return ( <div className={styles.root}>   
    <div className={styles.fieldItem}>
    <SectionSubtitle text={t('create_busyness')} />
    <RadioListField 
    name={'employment'}
    wrapperClassName={styles.radioWrapper}
    options={[
      {label: TranslateEmploymentType(EmploymentType.PartTime, t, true), value: EmploymentType.PartTime},
      {label: TranslateEmploymentType(EmploymentType.FullTime, t, true), value: EmploymentType.FullTime},
      {label: TranslateEmploymentType(EmploymentType.Project, t, true), value: EmploymentType.Project},
    ]} 
    />
    </div>

    <div className={styles.fieldItem}>

    <SectionSubtitle text={t('create_cv_schedule')} />
    <RadioListField 
    name={'schedule'}
    wrapperClassName={styles.radioWrapper}
    options={[
      {label: TranslateScheduleType(ScheduleType.FullDay, t), value: ScheduleType.FullDay},
      {label: TranslateScheduleType(ScheduleType.Flexible, t), value: ScheduleType.Flexible},
    ]} 
    />
    </div>
      
    <div className={styles.fieldItem}>
    <SectionSubtitle text={t('create_workPlace')}/>  
    <WorkPlace/>
    </div>
  </div>)
}