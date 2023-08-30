import RadioListField from 'components/fields/RadioListField'
import { EmploymentType, ScheduleType, WorkExperience } from 'types/enums'
import styles from './index.module.scss'

interface Props {
}

export default function VacancyExperience(props: Props) {

  return ( <div className={styles.root}>
    <p className={styles.title}>Опыт работы</p>
    <RadioListField 
    name={'experience'}
    wrapperClassName={styles.radioWrapper}
    options={[
      {value: null, label: 'Без опыта'},
      {value: WorkExperience.From1to3, label: '1-3 года'},
      {value: WorkExperience.From3to6, label: '3-6 лет'},
      {value: WorkExperience.From6, label: 'От 6 лет'}
    ]} 
    />

    <p className={styles.title}>График работы</p>
    <RadioListField 
    name={'schedule'}    
    wrapperClassName={styles.radioWrapper}
    options={[
      {value: ScheduleType.FullDay, label: 'Полный день'},
      {value: ScheduleType.Flexible, label: 'Гибкий график'}
    ]} 
    />

    <p className={styles.title}>Занятость</p>
    <RadioListField 
    name={'employment'}
    wrapperClassName={styles.radioWrapper}
    options={[
      {value: EmploymentType.PartTime, label: 'Частичная'},
      {value: EmploymentType.FullTime, label: 'Полная'},
      {value: EmploymentType.Project, label: 'Проектная'}
    ]} 
    />
  
  </div>)
}