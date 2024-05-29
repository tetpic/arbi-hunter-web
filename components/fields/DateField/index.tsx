import styles from './index.module.scss'
import { IField, InputStyleType } from 'types/types'
import { useField } from 'formik'
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import ru from 'date-fns/locale/ru'
import classNames from 'classnames'
import usePressAndHover from 'hooks/usePressAndHover'
// import FieldError from 'components/ui/FieldError'
import { useState } from 'react'
import InputField from '../InputField'
import CalendarSvg from 'components/svg/CalendarSvg'
import 'react-datepicker/dist/react-datepicker.css'

interface Props extends IField<string> {
  styleType: InputStyleType
  maxDate?: Date|string
  minDate?: Date|string
  visibleYearSelector?: boolean
  visibleMonthSelector?: boolean
  excludeDates?: Date[]
  className?: string
  inputClassName?: string
  dateFormat?: string
  formatOptions?: Intl.DateTimeFormatOptions
  showMonthYearPicker?: boolean
  showYearPicker?: boolean
  showTimeInput?: boolean
  openDefault?: boolean
  hideInput?: boolean
  datePickerProps?: ReactDatePickerProps
}

export default function DateField(props: Props) {
  const [wrapperRef, press] = usePressAndHover()
  const [field, meta, helpers] = useField<string>(props as any)
  const showError = meta.touched && !!meta.error
  const [date, setDate] = useState<Date | null>(new Date(field.value))



  const onChangeDate = (d : Date) => {
    const newDate = new Date(d)
    setDate(d)

    const dateFormatter = new Intl.DateTimeFormat('ru', props.formatOptions)
    const formattedDate =  dateFormatter.format(newDate) 
    helpers.setValue(formattedDate, true) 
  }

  return (
    <div className={classNames(styles.root, props.className)} data-field={props.name}>
      <div className={styles.wrapper} ref={wrapperRef}>
        <DatePicker
          name={props.name}
          className={classNames({
            [styles.input]: true,
            [styles.error]: showError,
            [styles.withIcon]: props.iconName,
            [styles.press]: press,
            
          }, 'myDatePicker')}
          locale={ru}
          open={props.openDefault}
          calendarClassName={styles.popperStyle}
          monthClassName={(date) => {
            return styles.month
          }}
          dayClassName={(dt)=> {
            const minDate =  new Date(props.minDate).setHours(0,0,0,0)
            if(dt.toDateString() === date.toDateString()||dt.toDateString() === new Date(field.value).toDateString()) {
              return styles.activeDay
            }
            else if (dt.getTime() > (props.maxDate?new Date(props.maxDate).getTime():new Date().getTime())) {
              return styles.disabledDay
            }
            else if(props.minDate&&dt.getTime() < new Date(minDate).getTime()) {
              return styles.disabledDay
            }
            else {
              return styles.availableDay
            }
          }}
          onChange={(date)=> {onChangeDate(date)}} 
          dateFormat={props.dateFormat||'dd/MM/yyyy'}
          placeholderText={props.placeholder}
          minDate={props.minDate&&new Date(props.minDate)}
          popperPlacement="bottom"
          showYearDropdown={props.visibleYearSelector}
          showMonthDropdown={props.visibleMonthSelector}
          showMonthYearPicker={props.showMonthYearPicker}
          showTimeInput={props.showTimeInput}
          showYearPicker={props.showYearPicker}
          scrollableYearDropdown={true}
          yearDropdownItemNumber={70}
          dropdownMode="scroll"
          
          
          maxDate={props.maxDate?new Date(props.maxDate):new Date()}
          customInput={
            <InputField 
            readonly={true}
            autocompleteOff={true} 
            validate={props.validate}
            className={classNames(styles.input, props.hideInput&&styles.hideInput, props.inputClassName)}  
            value={field.value} 
            name={field.name} 
            styleType={'default'} 
            type="text" 
            label={props.label}
            labelType='top'
            color={'default'} 
            error={meta.error}
            suffix={<CalendarSvg className={classNames([styles.icon, styles[props.styleType]])}/>}
            />
          }
          excludeDates={props.excludeDates}
          {...props.datePickerProps}
        />
        {props.styleType === 'default' && (
          <div className={classNames({
            [styles.label]: true,
            [styles.withIcon]: props.iconName,
          })}>
            {/* {props.label} */}
          </div>
        )}
        {/* {props.iconName && (
          <FieldIconSvg
            iconName={props.iconName}
            error={showError}
            className={classNames([styles.icon, styles[props.styleType], {[styles.withLabel]: props.label}])}
            color={'#828282'}
          />
        )} */}
        {/* {showError && <img src="/images/icons/field_fail.svg" alt="" className={styles.failIcon} />}
        <FieldError showError={showError}>{meta.error}</FieldError> */}
      </div>
    </div>
  )
}

