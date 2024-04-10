import styles from './index.module.scss'
import { Form, FormikProvider, useFormik } from 'formik'
import ContentLayout from '@/components/layout/ContentLayout'
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



interface Props {
}

function Day (props: {dayOfMonth: number, date?: Date, currentDate: Date}) {
  
  const minDate =  new Date().setHours(0,0,0,0)
  const isFutureDay = props.date?.getTime() >= new Date(minDate).getTime()
  const isPast = props.date?.getTime() < new Date(minDate).getTime()
  const isChosen = props.date?.toDateString() === new Date(props.currentDate)?.toDateString()

  return <P styleType={['w600', 'medium']} className={classNames(styles.day, isFutureDay&&styles.day_future, isPast&&styles.day_past, isChosen&&styles.day_chosen) }>{props.dayOfMonth}</P>

}

function Header (props: {picker: ReactDatePickerCustomHeaderProps, onSetTime: (time: string) => void}) {
  const [currenttime, setCurrentTime] = useState<string>('00:00') 
  const dropRef = useRef(null!)
  const [dropDown, openDropDown] = useDetectOutsideClick(dropRef, false)
  const currentHour = new Date().getHours()
  const isToday = new Date(props.picker.monthDate).getDay() === new Date().getDay()
  

  const getTimes = ():string[] => {
    const arr = []
    for (let i = isToday ? currentHour+1 : 0; i < 24; i++) {
      arr.push([i.toString(), '00'].join(':'))
      arr.push([i.toString(), '30'].join(':'))
    }
    return arr
  }

  const options = <OptionsList 
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
  onMouseLeave={()=>{

  }}
  />
  return <div className={styles.header}>
    <div className={styles.header__month}>
      <Button onClick={props.picker.decreaseMonth}><ArrowLeftSvg/></Button>
      <P styleType={['w600', 'large']}>{Formatter.formatDate(new Date(props.picker.monthDate), {timeOptions: {month: 'long', day: undefined}})}</P>
      <Button onClick={props.picker.increaseMonth}><ArrowRightSvg/></Button>
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

export default function TestStand(props: Props) {

  const formik = useFormik({
    initialValues: {
      date: undefined
    },
    onSubmit: () => {}
  })

  return (
    <ContentLayout>
      <div className={styles.root}> 
        <P  styleType={['w600', 'huge']}>{formik.values.date&&Formatter.formatDate(formik.values.date, {timeOptions: {year: 'numeric', hour: 'numeric', minute: 'numeric'}})}</P>
        <FormikProvider value={formik}>
          <Form>
          <DatePicker 
          open
          locale={ru}
          minDate={new Date()}
          value={formik.values.date}
          renderDayContents={(dayOfMonth: number, date?: Date) => <Day dayOfMonth={dayOfMonth} date={date} currentDate={formik.values.date}/>}
          renderCustomHeader={(p) => <Header picker={p} onSetTime={(s)=>{
            const formikDate = new Date(formik.values.date)
            const minutes = Number(s.split(':')[1])
            const hours = Number(s.split(':')[0])
            formikDate.setHours(hours, minutes, 0, 0)
            formik.setFieldValue('date', formikDate.toISOString())
          }}/>}  
          onChange={(date) => formik.setFieldValue('date', date.toISOString())}
          />
          </Form>
        </FormikProvider>
      
      </div>
    </ContentLayout>
  )
}