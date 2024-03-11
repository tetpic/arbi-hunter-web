import RadioListField from 'components/fields/RadioListField'
import { Answer, EmploymentType, ScheduleType } from 'types/enums'
import styles from './index.module.scss'
import SectionSubtitle from '../../../utils/SectionSubtitle'

interface Props {
}

export default function CvBusyness(props: Props) {

  return ( <div className={styles.root}>   
    <div className={styles.fieldItem}>
    <SectionSubtitle text={'Занятость'} title='Укажите сколько хотите работать'/>
    <RadioListField 
    name={'employment'}
    wrapperClassName={styles.radioWrapper}
    options={[
      {label: 'Частичная', value: EmploymentType.PartTime},
      {label: 'Полная', value: EmploymentType.FullTime},
      {label: 'Проектная', value: EmploymentType.Project},
    ]} 
    />
    </div>

    <div className={styles.fieldItem}>

    <SectionSubtitle text={'График работы'} title='Укажите удобный вам график'/>
    <RadioListField 
    name={'schedule'}
    wrapperClassName={styles.radioWrapper}
    options={[
      {label: 'Полный день', value: ScheduleType.FullDay},
      {label: 'Гибкий график', value: ScheduleType.Flexible},
      {label: 'Удаленная работа', value: ScheduleType.Remote},
    ]} 
    />
    </div>

    <div className={styles.fieldItem}>
    <SectionSubtitle text={'Переезд'}/>
    <RadioListField 
    name={'relocation'}
    wrapperClassName={styles.radioWrapper}
    options={[
      {label: 'Возможен', value: Answer.Yes},
      {label: 'Не возможен', value: Answer.No},
    ]} 
    />
    </div>

    <div className={styles.fieldItem}>
    <SectionSubtitle text={'Командировки'}/>
    <RadioListField 
    name={'businessTrips'}
    wrapperClassName={styles.radioWrapper}
    options={[
      {label: 'Командировки возможны', value: Answer.Yes},
      {label: 'Командировки не возможны', value: Answer.No},
    ]} 
    />
    </div>
  </div>)
}