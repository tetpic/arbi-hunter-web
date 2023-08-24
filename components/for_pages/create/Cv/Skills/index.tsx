import RadioListField from 'components/fields/RadioListField'
import AddButton from 'components/ui/AddButton'
import { useCvContext } from 'context/cv_state'
import { Answer } from 'types/enums'
import styles from './index.module.scss'

interface Props {
}

export default function Skills(props: Props) {

  const cvContext = useCvContext()

  return ( <div className={styles.root}>
    <AddButton onClick={()=>{}} text={'Добавить навык'}/>
    <AddButton onClick={()=>{}} text={'Иностранные языки'}/>
    <AddButton onClick={()=>{}} text={'Повышение квалификации и курсы'}/>
    <div className={styles.radioSection}>
      <p className={styles.subTitle}>Переезд</p>
      <RadioListField 
      name={'relocation'} 
      wrapperClassName={styles.radioWrapper}
      options={[
        {value: Answer.Yes, label: 'Возможен'},
        {value: Answer.No, label: 'Не возможен'}
      ]}/>
    </div>
    <AddButton onClick={()=> {}} text={'Добавить порфтолио'} />
  
  </div>)
}