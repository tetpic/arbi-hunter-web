import RadioListField from 'components/fields/RadioListField'
import { EmploymentType, ScheduleType } from 'types/enums'
import styles from './index.module.scss'

interface Props {
}

export default function Busyness(props: Props) {

  return ( <div className={styles.root}>   

      <p className={styles.subTitle} title={'Укажите удобный вам график'}>График работы</p>
      <RadioListField 
      name={'schedule'}
      wrapperClassName={styles.radioWrapper}
      options={[
        {label: 'Полный день', value: ScheduleType.FullDay},
        {label: 'Гибкий график', value: ScheduleType.Flexible},
        {label: 'Удаленная работа', value: ScheduleType.Remote},
      ]} 
      />
   
      <p className={styles.subTitle} title={'Укажите сколько хотите работать'}>Занятость</p>
      <RadioListField 
      name={'employment'}
      wrapperClassName={styles.radioWrapper}
      options={[
        {label: 'Частичная', value: EmploymentType.PartTime},
        {label: 'Полная', value: EmploymentType.FullTime},
        {label: 'Гибкий рабочий день', value: EmploymentType.Project},
      ]} 
      />
   
  </div>)
}