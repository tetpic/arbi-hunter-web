import styles from './index.module.scss'
import { useField } from 'formik'
import P from '@/components/ui/P'
import DatePicker, { ReactDatePickerCustomHeaderProps } from 'react-datepicker'
import classNames from 'classnames'
import ru from 'date-fns/locale/ru'
import Formatter from 'utils/formatter'
import Button from '@/components/ui/Button'
import ArrowLeftSvg from '@/components/svg/ArrowLeftSvg'
import ArrowRightSvg from '@/components/svg/ArrowRightSvg'
import { useRef, useState } from 'react'
import ArrowDownSvg from '@/components/svg/ArrowDownSvg'
import OptionsList from '@/components/ui/OptionsList'
import OptionsDropDown from '@/components/ui/OptionsDropDown'
import { useDetectOutsideClick } from '@/components/hooks/useDetectOutsideClick'
import { IField } from 'types/types'


interface Props extends IField<string> {
  name: string
  maxDate?: Date
}

function Day (props: {dayOfMonth: number, date?: Date, currentDate: Date, maxDate?: Date}) {
  
  const minDate =  new Date().setHours(0,0,0,0)
  const isActiveDay = props.date?.getTime() >= new Date(minDate).getTime()&&props.date.getTime() <= new Date(props.maxDate).getTime()
  
  const isPast = props.date?.getTime() < new Date(minDate).getTime()
  const isChosen = props.date?.toDateString() === new Date(props.currentDate)?.toDateString()

  return <P styleType={['w600', 'medium']} className={classNames(styles.day, isActiveDay&&styles.day_future, isPast&&styles.day_past, isChosen&&styles.day_chosen) }>{props.dayOfMonth}</P>

}

function Header (props: {picker: ReactDatePickerCustomHeaderProps, onSetTime: (time: string) => void}) {
  const [currenttime, setCurrentTime] = useState<string>('00:00') 
  const dropRef = useRef(null!)
  const [dropDown, openDropDown] = useDetectOutsideClick(dropRef, false)
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinutes = now.getMinutes()
  const isToday = new Date(props.picker.monthDate).getDay() === new Date().getDay()
  

  const getTimes = ():string[] => {
    const arr = []
    for (let i = isToday ? currentHour : 0; i < 24; i++) {
      if(isToday && i === currentHour && currentMinutes < 30) {
        arr.push([i.toString(), '30'].join(':'))
      }
      else if(isToday && i === currentHour && currentMinutes >= 30) {
        
      }
      else {
        arr.push([i.toString(), '00'].join(':'))
        arr.push([i.toString(), '30'].join(':'))
      }
    }
    return arr
  }

  const options = (
    <OptionsList 
    className={styles.timeOptions}
    options={getTimes().map(el=> {
      return {
        title: el,
        value: el,
        onClick: () => {
          setCurrentTime(el)
          props.onSetTime(el)
          openDropDown(false)
        }
      }
    })} 
    onMouseLeave={()=>{}}
    />
  )
  return <div className={styles.header}>
    <div className={styles.header__month}>
      <Button type='button'  disabled={props.picker.prevMonthButtonDisabled} onClick={props.picker.decreaseMonth}><ArrowLeftSvg/></Button>
      <P styleType={['w600', 'large']}>{Formatter.formatDate(new Date(props.picker.monthDate), {timeOptions: {month: 'long', day: undefined}})}</P>
      <Button type='button' disabled={props.picker.nextMonthButtonDisabled} onClick={props.picker.increaseMonth}><ArrowRightSvg/></Button>
    </div>
    <div className={styles.timePicker}>
      <P onClick={()=>{openDropDown(true)}}  styleType={['alignCenter', 'w500', 'medium']}>{currenttime} <ArrowDownSvg/></P>
      <OptionsDropDown 
      options={options} 
      active={dropDown} 
      getRef={(r)=>{dropRef.current = r}} 
      onClose={()=>{}}  
      />
    </div>
  </div>
}

export default function ShopDateTimePicker(props: Props) {
  const [field, meta, helpers] = useField<string>(props as any)


  return (<div className={styles.root}> 
    <DatePicker 
    open
    popperPlacement='top'
    popperClassName={styles.popper}
    locale={ru}
    minDate={new Date()}
    maxDate={props.maxDate}
    customInput={<></>}
    value={field.value}
    renderDayContents={(dayOfMonth: number, date?: Date) => {
      return (
        <Day 
        dayOfMonth={dayOfMonth} 
        date={date} 
        currentDate={new Date(field.value)}
        maxDate={props.maxDate}
        />
      )
    }}

    renderCustomHeader={(p) => <Header picker={p} onSetTime={(s)=>{
      const formikDate = new Date(field.value)||new Date()
      const minutes = Number(s.split(':')[1])
      const hours = Number(s.split(':')[0])
      formikDate.setHours(hours, minutes, 0, 0)
      helpers.setValue(formikDate.toISOString())
    }}/>}  
    onChange={(date) => helpers.setValue( date.toString())}
    />
  </div>)
}