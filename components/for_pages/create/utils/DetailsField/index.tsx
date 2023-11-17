import styles from './index.module.scss'

import InputField from 'components/fields/InputField'
import TextAreaField from 'components/fields/TextAreaField'
import BackTextButton from 'components/ui/BackTextButton'
import Button from 'components/ui/Button'
import { TimeLine } from 'data/interfaces/Common'
import { ChangeEvent, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import classNames from 'classnames'
import { Form, FormikProvider, useFormik } from 'formik'
import { useAppContext } from 'context/state'
import Validator from 'utils/Validator'
import { SnackbarType } from 'types/enums'

export interface DetailsFieldProps<T> {
  onClose: ()=> void
  onSave: (f: T) => void
  onEditValidator: (fields: T) => boolean|{error: string}
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
      dateName?: keyof T
      dateValue?: string
      errorState?: string
      required?: boolean
    }[]
  }
  inputsSettings?: {
    value: string, 
    name: keyof T, 
    label: string, 
    type?: 'input'|'textarea', 
    required?: boolean
    errorState?: string}[]
}

export default function DetailsField<T extends TimeLine>(props: DetailsFieldProps<T>) {
  const appContext = useAppContext()
  const [fields, setField] = useState<T>(props.set)


  const onSubmit = (data: {[key: string]: string}) => {
    
    const isValid = props.onEditValidator(data as any)
    if(isValid instanceof Object) {
      appContext.showSnackbar(isValid.error, SnackbarType.error)
    }
    else {
      props.onSave(data as any)
    }
  }

  let initialValues: {[key: string]: string} = {}
  props.inputsSettings.map(el=> initialValues[el.name.toString()] = el.value)
  props.datePickerSettings.dates.map(el=> initialValues[el.dateName.toString()] = el.dateValue)

  const formik = useFormik<{[key: string]: string}>({
    initialValues: initialValues,
    onSubmit: onSubmit
  })

  const onChangeHelper = (v: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>, name: keyof T) => {
    setField(s => {return {...s, [name]: v.target.value}})
    formik.setFieldValue(name.toString(), v.target.value)
  }

  const onChangeDate = (d : Date, type: keyof T) => {
    const date = new Date(d)
    const dateFormatter = new Intl.DateTimeFormat('ru', props.datePickerSettings.formatter)
    const formattedDate =  dateFormatter.format(date) 
    setField(s=> {return {...s, [type]: formattedDate}}) 
    formik.setFieldValue(type.toString(), formattedDate)
  }

  // useEffect(()=>{
  //   if(props.onEditValidator) {
  //     const isValid = props.onEditValidator(fields)
  //     isValid instanceof Object&&appContext.showSnackbar(isValid.error, SnackbarType.error)
  //   }
  // }, [fields])

  return (
  <div className={styles.root}>
    <BackTextButton onClick={props.onClose}/>
    <p className={styles.title}>{props.title}</p>
    <FormikProvider value={formik}>
      <Form className={styles.inputsWrapper}>
        {props.datePickerSettings?.on&&
          <div className={styles.timeWrapper}>
              {props.datePickerSettings?.dates?.map(el => {
                return (
                  <DatePicker 
                  onChange={(date)=> {onChangeDate(date, el.dateName)}} 
                  dateFormat={el.format} 
                  showYearDropdown={el.yearDropdown} 
                  showMonthDropdown={el.monthDropdown} 
                  {...{[el.pickerType]: true}}
                  name={el.dateName.toString()}
                  maxDate={new Date()}
                  value={fields[el.dateName].toString() as string}
                  customInput={
                    <InputField 
                    autocompleteOff={true} 
                    className={classNames(styles.input)}  
                    value={fields[el.dateName]} 
                    labelType={'top'} 
                    name={el.dateName.toString()} 
                    styleType={'default'} 
                    type="text" 
                    color={'default'} 
                    label={el.inputLabel} 
                    error={el.errorState}
                    validateOnSubmit
                    validate={el.required&&Validator.required}
                    />
                  }
                  />
                  )
                })
              }
          </div>
        }

        {props.inputsSettings&&props.inputsSettings.map((el, index) => {
          if(el.type === 'textarea') {
          return (
            <TextAreaField 
            key={index} 
            label={el.label} 
            value={fields[el.name].toString()} 
            onChange={(v)=> onChangeHelper(v, el.name)} 
            name={el.name.toString()} 
            autoSize={true}
            />
          ) 
        }
        return (
          <InputField 
          key={index} 
          autocompleteOff={true} 
          className={classNames(styles.input)}  
          value={fields[el.name]} 
          onChange={(v)=> onChangeHelper(v, el.name)} 
          labelType={'top'} 
          styleType={'default'} 
          color={'default'} 
          name={el.name.toString()} 
          label={el.label}
          error={el.errorState}
          validate={el.required&&Validator.required}
          />
          ) 
      })}
      </Form>
      </FormikProvider >
    <Button className={styles.buttonSave} type={'button'} onClick={()=>formik.submitForm()}>Сохранить</Button>
  </div>)
}