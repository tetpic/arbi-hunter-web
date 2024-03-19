import RadioListField from 'components/fields/RadioListField'
import { EmploymentType, ScheduleType } from 'types/enums'
import styles from './index.module.scss'
import WorkPlace from '../WorkPlace'
import SectionSubtitle from '../../SectionSubtitle'

interface Props {
}

export default function Busyness(props: Props) {

  return ( <div className={styles.root}>   
    <div className={styles.fieldItem}>
    <SectionSubtitle text={'Занятость'} title='Укажите сколько хотите работать'/>
    <RadioListField 
    name={'employment'}
    wrapperClassName={styles.radioWrapper}
    options={[
      {label: 'Частичная', value: EmploymentType.PartTime},
      {label: 'Полная', value: EmploymentType.FullTime},
      {label: 'Гибкий рабочий день', value: EmploymentType.Project},
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
    ]} 
    />
    </div>
      
    <div className={styles.fieldItem}>
    <SectionSubtitle text={'Место работы'}/>  
    <WorkPlace/>
    </div>
  </div>)
}