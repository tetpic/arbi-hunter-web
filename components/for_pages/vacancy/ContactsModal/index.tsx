import { IVacancy } from 'data/interfaces/IVacancy'
import styles from './index.module.scss'
import P from '@/components/ui/P'
import CrossSvg from '@/components/svg/CrossSvg'
import Button from '@/components/ui/Button'
import { useDetectOutsideClick } from '@/components/hooks/useDetectOutsideClick'
import { useEffect, useRef } from 'react'
import classNames from 'classnames'
import UserSvg from '@/components/svg/UserSvg'
import MailConvertSvg from '@/components/svg/MailConvertSvg'
import PhoneSvg from '@/components/svg/PhoneSvg'
import TelegramSvg from '@/components/svg/TelegramSvg'

interface Props {
  vacancy: IVacancy
  onClose?: ()=>void
  isActive?: boolean
}

export default function ContactsModal(props: Props) {
  const ref = useRef()
  const [active, setActive] = useDetectOutsideClick(ref, props.isActive)
  
  useEffect(()=>{
    if(!active) {
      props.onClose()
    }
  }, [active])



  return (<div className={classNames(styles.root, active&&styles.active)} ref={ref} > 
    <div className={styles.top}>
      <P styleType={['large', 'w600']}>Контактная информация</P>
      <Button styleType={['icon', 'backTransparent']} onClick={()=> setActive(false)}><CrossSvg/></Button>
    </div>
    
    <P styleType={['alignCenter', 'medium', 'w500']}><Button styleType={['icon', 'black']}><UserSvg/></Button> {props.vacancy.contactName}</P>
    <P styleType={['alignCenter', 'medium', 'w500']}><Button styleType={['icon', 'black']}><MailConvertSvg/></Button> {props.vacancy.email}</P>
    <P styleType={['alignCenter', 'medium', 'w500']}><Button styleType={['icon', 'black']}><PhoneSvg/></Button> {props.vacancy.phone}</P>
    <P styleType={['alignCenter', 'medium', 'w500']}><Button styleType={['icon', 'black']}><TelegramSvg/></Button> {props.vacancy.telegramNickname}</P>
    <Button styleType={['gradient', 'wide']}>Написать в чат</Button>
  </div>)
}