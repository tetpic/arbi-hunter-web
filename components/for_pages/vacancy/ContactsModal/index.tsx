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
import { ApplicationStatus, ProposalRequestType } from 'types/enums'
import ChatRepository from 'data/repositories/ChatRepository'
import { useRouter } from 'next/router'

interface Props {
  vacancy: IVacancy
  onClose?: ()=>void
  isActive?: boolean
}

export default function ContactsModal(props: Props) {
  const {t} = useTranslation()
  const ref = useRef()
  const [active, setActive] = useDetectOutsideClick(ref, props.isActive)
  const router = useRouter()

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

  const openChat = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    debugger
    const activeChat = props.vacancy.proposalsToCurrentUser.filter(el => el.type !== ProposalRequestType.Rejection&&el.status === ApplicationStatus.Applied)
    if(activeChat[0]){
      ChatRepository.getChatByContactId(props.vacancy.profile.id, {proposalId: props.vacancy.proposalsToCurrentUser[0].id})
      .then(res=>{
        debugger
        if(res) {
          router.push('/messenger?chat=' + res.id)
        }
      })
    }
  }

  
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
    {
      props.vacancy.proposalsToCurrentUser.filter(el => el.type !== ProposalRequestType.Rejection&&el.status === ApplicationStatus.Applied).length>0&&
       <Button onClick={openChat} styleType={['gradient', 'wide']}>{t('vacancy_page_writeInChat')}</Button>
    }
  </div>)
}