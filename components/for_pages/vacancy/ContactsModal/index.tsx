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
import useTranslation from 'next-translate/useTranslation'

interface Props {
  vacancy: IVacancy
  onClose?: ()=>void
  isActive?: boolean
}

export default function ContactsModal(props: Props) {
  const {t} = useTranslation()
  const ref = useRef()
  const [active, setActive] = useDetectOutsideClick(ref, props.isActive)

  const contacts = [
    {
      text: props.vacancy.contactName, 
      icon: <UserSvg/>
    },
    {
      text: props.vacancy.email, 
      icon: <MailConvertSvg/>
    },
    {
      text: props.vacancy.phone, 
      icon: <PhoneSvg/>
    },
    {
      text: props.vacancy.telegramNickname, 
      icon: <TelegramSvg/>
    }
  ].filter(el => Boolean(el.text))

  
  useEffect(()=>{
    if(!active) {
      props.onClose()
    }
  }, [active])


  return (<div className={classNames(styles.root, active&&styles.active)} ref={ref} > 
    <div className={styles.top}>
      <P styleType={['large', 'w600']} useThemeColor>{t('vacancy_page_contactInfo')}</P>
      <Button 
      styleType={['icon', 'backTransparent']} 
      altStyleType={['icon', 'invertSvg']}
      onClick={()=> setActive(false)}><CrossSvg/></Button>
    </div>
    {contacts.map(el => {
      return (
        <P 
        styleType={['alignCenter', 'medium', 'w500']} useThemeColor
        >
        <Button 
        styleType={['icon', 'black']}
        altStyleType={['icon', 'gradient']}
        >{el.icon}</Button> 
          {el.text}
        </P>
      )
    })}    
    <Button styleType={['gradient', 'wide']}>{t('vacancy_page_writeInChat')}</Button>
  </div>)
}