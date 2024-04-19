import RadioListField from 'components/fields/RadioListField'
import { Answer, EmploymentType, ScheduleType } from 'types/enums'
import styles from './index.module.scss'
import SectionSubtitle from '../../../utils/SectionSubtitle'
import { TranslateEmploymentType, TranslateScheduleType } from 'utils/enumsTranslations'
import useTranslation from 'next-translate/useTranslation'

interface Props {
}

export default function CvBusyness(props: Props) {
  const {t} = useTranslation()

  return ( <div className={styles.root}>   
    <div className={styles.fieldItem}>
    <SectionSubtitle text={t('create_cv_employment')} />
    <RadioListField 
    name={'employment'}
    wrapperClassName={styles.radioWrapper}
    options={[
      {label: TranslateEmploymentType(EmploymentType.PartTime, t), value: EmploymentType.PartTime},
      {label: TranslateEmploymentType(EmploymentType.FullTime, t), value: EmploymentType.FullTime},
      {label: TranslateEmploymentType(EmploymentType.Project, t), value: EmploymentType.Project},
    ]} 
    />
    </div>

    <div className={styles.fieldItem}>

    <SectionSubtitle text={t('create_cv_schedule')} />
    <RadioListField 
    name={'schedule'}
    wrapperClassName={styles.radioWrapper}
    options={[
      {label:  TranslateScheduleType(ScheduleType.FullDay, t), value: ScheduleType.FullDay},
      {label: TranslateScheduleType(ScheduleType.Flexible, t), value: ScheduleType.Flexible},
      {label: TranslateScheduleType(ScheduleType.Remote, t), value: ScheduleType.Remote},
    ]} 
    />
    </div>

    <div className={styles.fieldItem}>
    <SectionSubtitle text={t('create_cv_relocation')}/>
    <RadioListField 
    name={'relocation'}
    wrapperClassName={styles.radioWrapper}
    options={[
      {label: t('create_cv_relocationYes'), value: Answer.Yes},
      {label: t('create_cv_relocationNo'), value: Answer.No},
    ]} 
    />
    </div>

    <div className={styles.fieldItem}>
    <SectionSubtitle text={t('create_cv_businessTrips')}/>
    <RadioListField 
    name={'businessTrips'}
    wrapperClassName={styles.radioWrapper}
    options={[
      {label: t('create_cv_businessTripsYes'), value: Answer.Yes},
      {label: t('create_cv_businessTripsNo'), value: Answer.No},
    ]} 
    />
    </div>
  </div>)
}