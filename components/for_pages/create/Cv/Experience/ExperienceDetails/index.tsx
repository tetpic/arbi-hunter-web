import InputField from 'components/fields/InputField'
import Button from 'components/ui/Button'
import styles from './index.module.scss'
import TextAreaField from 'components/fields/TextAreaField'
import { ExperienceInfo } from 'data/interfaces/ICV'
import { ChangeEvent, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BackTextButton from 'components/ui/BackTextButton'

interface Props {
  onClose: ()=> void
  onSave: (f: ExperienceInfo) => void
  activeDetails?: ExperienceInfo
}

export default function ExperienceDetails(props: Props) {

  const [fields, setField] = useState<ExperienceInfo>(
    {
      fromDate: props.activeDetails?.fromDate||'', 
      toDate: props.activeDetails?.toDate||'',
      company: props.activeDetails?.company||'',
      position: props.activeDetails?.position||'', 
      description: props.activeDetails?.description||''
    })

  const onChangeHelper = (v: ChangeEvent<HTMLInputElement>, name: keyof ExperienceInfo) => {
    setField(s => {return {...s, [name]: v.target.value}})
  }

  const onChangeDate = (d : Date, type: ExperienceInfo['fromDate'|'toDate']) => {
    const date = new Date(d)
    const dateFormatter = new Intl.DateTimeFormat('ru', {month: '2-digit', year: 'numeric'})
    const formattedDate =  dateFormatter.format(date) 
    setField(s=> {return {...s, [type]: formattedDate}}) 
  }

  return (
    <div className={styles.root}>
      <BackTextButton onClick={props.onClose}/>
      <p className={styles.title}>Место работы</p>
      <div className={styles.inputsWrapper}>
        <div className={styles.timeWrapper}>    
          <DatePicker 
          onChange={(v, e)=> {onChangeDate(v, 'fromDate')}} 
          dateFormat="MM.yyyy" 
          showMonthDropdown={true} 
          showMonthYearPicker
          name={'set_fromDate'}
          value={fields.fromDate}
          customInput={
            <InputField className={styles.input} value={fields.fromDate} labelType={'top'} name='set_fromDate' styleType={'default'} type="text" color={'default'} label={'Начало работы:'} />
          }
          />
          <DatePicker 
          onChange={(v, e)=> {onChangeDate(v, 'toDate')}} 
          dateFormat="MM:yyyy" 
          showMonthDropdown={true} 
          showMonthYearPicker
          name={'set_toDate'}
          value={fields.toDate}
          customInput={
            <InputField className={styles.input} value={fields.toDate} labelType={'top'} name='set_toDate' styleType={'default'} type="text" color={'default'} label={'Начало работы:'} />
          }
          />        
        </div>
        
      
        <InputField className={styles.input} value={fields.company} onChange={(v)=> onChangeHelper(v, 'company')} labelType={'top'} styleType={'default'} color={'default'} name={'setCompany'} label={'Организация:'}/>
        <InputField className={styles.input} value={fields.position} onChange={(v)=> onChangeHelper(v, 'position')} labelType={'top'} styleType={'default'} color={'default'} name={'setProfile'} label={'Должность:'}/>
        <TextAreaField label='Обязанности:' value={fields.description} onChange={(v)=> onChangeHelper(v, 'description')} name={'setDescription'} autoSize={true}/>
      </div>
      <Button className={styles.buttonSave} type={'button'} onClick={()=> props.onSave(fields)}>Сохранить</Button>
    </div>
  )
}