import styles from './index.module.scss'
import classnames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { useAppContext } from 'context/state'
import { ProfileType } from 'data/interfaces/IRegistration'
import { useRouter } from 'next/router'
import { useUserContext } from 'context/user_state'

interface Props {
}

export default function Header(props: Props) {

  const {profileType, setProfileType} = useUserContext()

  const usrBtn = useRef<HTMLButtonElement>(null!)
  const cmpBtn = useRef<HTMLButtonElement>(null!)

  const router = useRouter()

  const regPath = '/registration'
  const loginPath = '/login'

  return ( 
    <div className={styles.root}>
      <Image src={'/favicon.svg'} alt={'logo'} width={40} height={40}/>
      <div className={classnames(styles.contentWrapper, 'contentWrapper')}>
        <div className={styles.modeWrapper}>
          <div 
          className={classnames(styles.buttonBack, profileType ===ProfileType.Hirer&&styles.buttonBack_active)} 
          style={{width: profileType ===ProfileType.Hirer?cmpBtn.current?.clientWidth: usrBtn?.current?.clientWidth}}
          >
          </div>

          <button 
          ref={usrBtn} 
          className={classnames(styles.modeButton, profileType === ProfileType.Employee &&styles.modeButton_active)} 
          onClick={()=>{setProfileType(ProfileType.Employee)}}
          >
            Соискатель
          </button>

          <button 
          ref={cmpBtn} 
          className={classnames(styles.modeButton, profileType === ProfileType.Hirer &&styles.modeButton_active)} 
          onClick={()=>{setProfileType(ProfileType.Hirer)}}
          >
            Компания
          </button>
        </div>

        <div className={styles.linksWrapper}>
          <Link className={styles.link} href={'/recruiting'} >Рекрутинг</Link>
          <Link className={styles.link} href={'/media'}>Медиа</Link>
          <Link className={styles.link} href={'/e-lessons'}>Онлайн обучение</Link>
        </div>
        
        <div className={styles.userWrapper}>
          <Link className={classnames(styles.userLink, router.pathname === regPath&&styles.userLink_active)} href={'/registration'}>Регистрация</Link>
          <Link className={classnames(styles.userLink, router.pathname === loginPath&&styles.userLink_active)} href={'/login'}>Вход</Link>
        </div>
      </div>
    </div>
  )
}