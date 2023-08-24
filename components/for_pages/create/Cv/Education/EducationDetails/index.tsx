import InputField from 'components/fields/InputField';
import BackTextButton from 'components/ui/BackTextButton'
import Button from 'components/ui/Button';
import { EducationInfo } from 'data/interfaces/ICV';
import { ChangeEvent, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from './index.module.scss'

interface Props {
  onClose: ()=> void
  onSave: (f: EducationInfo) => void
  activeDetails?: EducationInfo
}

export default function EducationDetails(props: Props) {


  const [fields, setField] = useState<EducationInfo>(
  {
    fromDate: props.activeDetails?.fromDate||'', 
    toDate: props.activeDetails?.toDate||'',
    institution: props.activeDetails?.institution||'',
    speciality: props.activeDetails?.speciality||'', 
  })

  const onChangeHelper = (v: ChangeEvent<HTMLInputElement>, name: keyof EducationInfo) => {
    setField(s => {return {...s, [name]: v.target.value}})
  }

  const onChangeDate = (d : Date, type: EducationInfo['fromDate'|'toDate']) => {
    const date = new Date(d)
    const dateFormatter = new Intl.DateTimeFormat('ru', {year: 'numeric'})
    const formattedDate =  dateFormatter.format(date) 
    setField(s=> {return {...s, [type]: formattedDate}}) 
  }

  

  return (<div className={styles.root}>
    <BackTextButton onClick={props.onClose}/>
    <p className={styles.title}>Место учебы</p>
    <div className={styles.inputsWrapper}>

      <div className={styles.timeWrapper}>
        <DatePicker 
        onChange={(v, e)=> {onChangeDate(v, 'fromDate')}} 
        dateFormat="yyyy" 
        showYearDropdown={true} 
        showYearPicker
        name={'set_fromDate'}
        value={fields.fromDate}
        customInput={
          <InputField className={styles.input} value={fields.fromDate} labelType={'top'} name='set_fromDate' styleType={'default'} type="text" color={'default'} label={'Начало учёбы:'} />
        }
        />
        <DatePicker 
        onChange={(v, e)=> {onChangeDate(v, 'toDate')}} 
        dateFormat="yyyy" 
        showYearDropdown={true} 
        showYearPicker
        name={'set_toDate'}
        value={fields.toDate}
        customInput={
          <InputField className={styles.input} value={fields.toDate} labelType={'top'} name='set_toDate' styleType={'default'} type="text" color={'default'} label={'Окончание:'} />
        }
        />  
      </div>

      <InputField className={styles.input} value={fields.institution} onChange={(v)=> onChangeHelper(v, 'institution')} labelType={'top'} styleType={'default'} color={'default'} name={'setInstitution'} label={'Заведение:'}/>
      <InputField className={styles.input} value={fields.speciality} onChange={(v)=> onChangeHelper(v, 'speciality')} labelType={'top'} styleType={'default'} color={'default'} name={'setSpeciality'} label={'Специализация:'}/>

    </div>
    <Button className={styles.buttonSave} type={'button'} onClick={()=> props.onSave(fields)}>Сохранить</Button>

  </div>)
}