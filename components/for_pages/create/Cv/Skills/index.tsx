import RadioListField from 'components/fields/RadioListField'
import CrossSvg from 'components/svg/CrossSvg'
import AddButton from 'components/ui/AddButton'
import { useCvContext } from 'context/cv_state'
import { useAppContext } from 'context/state'
import { ISkill } from 'data/interfaces/ICV'
import { useFormikContext } from 'formik'
import { useEffect } from 'react'
import { Answer, ModalType } from 'types/enums'
import styles from './index.module.scss'


interface Props {
}

export default function Skills(props: Props) {

  const cvContext = useCvContext()
  const appContext  = useAppContext()

  const {setFieldValue} = useFormikContext()

  useEffect(()=>{
    setFieldValue('skillsIds', cvContext.currentCv?.skillsIds)
  }, [cvContext.currentCv])

  const addSkillHandler = () => {
    appContext.showModal(ModalType.SkillsModal)
  }


  

  return ( <div className={styles.root}>
    <AddButton onClick={addSkillHandler} text={'Добавить навык'}/>
    {cvContext.helpObjects?.skills.length > 0 &&
      <div className={styles.itemsWrapper}>
        {cvContext.helpObjects&&cvContext.helpObjects?.skills.map((el: ISkill)=> <p className={styles.item}>{el.title} <CrossSvg/></p>)}
      </div>
    } 
    <AddButton onClick={()=>{appContext.showModal(ModalType.LanguageModal)}} text={'Иностранные языки'}/>
  
    {/* {countries.getSupportedLanguages().map(el=> <p>{el}</p>)} */}

    <AddButton onClick={()=>{}} text={'Повышение квалификации и курсы'}/> 
    <AddButton onClick={()=>{}} text={'Источники трафика'}/> 
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