import InputField from 'components/fields/InputField'
import BackArrowSvg from 'components/svg/BackArrowSvg'
import Button from 'components/ui/Button'
import styles from './index.module.scss'
import { useField } from 'formik'
import TextAreaField from 'components/fields/TextAreaField'
import { ExperienceInfo } from 'data/interfaces/ICV'
import { ChangeEvent, useState } from 'react'

interface Props {
  onClose: ()=> void
  onSave: (f: ExperienceInfo) => void
}

export default function ExperienceDetails(props: Props) {



  const [fields, setField] = useState<ExperienceInfo>({fromDate: '', toDate: '', company: '', position: '', description: ''})

  const onChangeHelper = (v: ChangeEvent<HTMLInputElement>, name: keyof ExperienceInfo) => {
    
    setField(s => {return {...s, [name]: v.target.value}})
  }

  return (
    <div className={styles.root}>
      <p className={styles.backButton} onClick={props.onClose}><BackArrowSvg/> Назад</p>
      <p className={styles.title}>Место работы</p>
      <div className={styles.inputsWrapper}>
        <div className={styles.timeWrapper}>    
            {/* caniuse плохая поддержка type=month, переделать на datePicker */}
          <InputField className={styles.input} onChange={(v)=> onChangeHelper(v, 'fromDate')} labelType={'top'} name='1' styleType={'default'} type={'month'} color={'default'} label={'Начало работы:'} />
          <InputField className={styles.input} onChange={(v)=> onChangeHelper(v, 'toDate')} labelType={'top'} name='2' styleType={'default'} type={'month'} color={'default'} label={'Окончание:'}/>
        </div>
        {/* <DateField styleType={'default'} name={'fromDate'}/> */}
      
        <InputField className={styles.input} onChange={(v)=> onChangeHelper(v, 'company')} labelType={'top'} styleType={'default'} color={'default'} name={'3'} label={'Организация:'}/>
        <InputField className={styles.input} onChange={(v)=> onChangeHelper(v, 'position')} labelType={'top'} styleType={'default'} color={'default'} name={'4'} label={'Должность:'}/>
        <TextAreaField label='Обязанности:' onChange={(v)=> onChangeHelper(v, 'description')} name={'5'} autoSize={true}/>
      </div>
      <Button className={styles.buttonSave} type={'button'} onClick={()=> props.onSave(fields)}>Сохранить</Button>
    </div>
  )
}