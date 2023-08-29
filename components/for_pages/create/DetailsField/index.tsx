import InputField from 'components/fields/InputField';
import TextAreaField from 'components/fields/TextAreaField';
import BackTextButton from 'components/ui/BackTextButton'
import Button from 'components/ui/Button';
import { TimeLine } from 'data/interfaces/ICV';
import { ChangeEvent, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from './index.module.scss'

interface Props<T> {
  onClose: ()=> void
  onSave: (f: T) => void
  set: T
  title: string
  datePickerSettings?: {
    formatter?: Intl.DateTimeFormatOptions
    on: boolean,
    dates: {
      format: string
      pickerType?: 'showYearPicker'|'showMonthYearPicker'
      yearDropdown?: boolean
      monthDropdown?: boolean
      inputLabel?: string 
      dateName?: string
      dateValue?: keyof T
    }[]
  }
  inputsSettings?: {value: keyof T, name: string, label: string, type?: 'input'|'textarea'}[]
}

export default function DetailsField<T extends TimeLine>(props: Props<T>) {


  const [fields, setField] = useState<T>(props.set)

  const onChangeHelper = (v: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>, name: keyof T) => {
    setField(s => {return {...s, [name]: v.target.value}})
  }

  const onChangeDate = (d : Date, type: keyof T) => {
    const date = new Date(d)
    const dateFormatter = new Intl.DateTimeFormat('ru', props.datePickerSettings.formatter)
    const formattedDate =  dateFormatter.format(date) 
    setField(s=> {return {...s, [type]: formattedDate}}) 
  }

  return (<div className={styles.root}>
    <BackTextButton onClick={props.onClose}/>
    <p className={styles.title}>{props.title}</p>
    <div className={styles.inputsWrapper}>
      {props.datePickerSettings?.on&&
        <div className={styles.timeWrapper}>
          {props.datePickerSettings?.dates?.map(el => {
            return (
              <DatePicker 
              onChange={(date)=> {onChangeDate(date, el.dateValue)}} 
              dateFormat={el.format} 
              showYearDropdown={el.yearDropdown} 
              showMonthDropdown={el.monthDropdown} 
              {...{[el.pickerType]: true}}
              name={el.dateName}
              value={fields[el.dateValue].toString() as string}
              customInput={
                <InputField className={styles.input} value={fields[el.dateValue]} labelType={'top'} name={el.dateName} styleType={'default'} type="text" color={'default'} label={el.inputLabel} />
              }
              />
            )
          })}
        </div>
      }

      {props.inputsSettings&&props.inputsSettings.map(el => {
        if(el.type === 'textarea') {
          return <TextAreaField label={el.label} value={fields[el.value].toString()} onChange={(v)=> onChangeHelper(v, el.value)} name={el.name} autoSize={true}/>
        }
        return <InputField className={styles.input} value={fields[el.value ]} onChange={(v)=> onChangeHelper(v, el.value)} labelType={'top'} styleType={'default'} color={'default'} name={el.name} label={el.label}/>
      })}

      {/* <InputField className={styles.input} value={fields.institution} onChange={(v)=> onChangeHelper(v, 'institution')} labelType={'top'} styleType={'default'} color={'default'} name={'setInstitution'} label={'Заведение:'}/>
      <InputField className={styles.input} value={fields.speciality} onChange={(v)=> onChangeHelper(v, 'speciality')} labelType={'top'} styleType={'default'} color={'default'} name={'setSpeciality'} label={'Специализация:'}/> */}

    </div>
    <Button className={styles.buttonSave} type={'button'} onClick={()=> props.onSave(fields)}>Сохранить</Button>

  </div>)
}