import classnames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ProfileType } from 'data/interfaces/IRegistration'
import { useRouter } from 'next/router'
import { useUserContext } from 'context/user_state'
import UserPic from 'components/ui/UserPic'
import Spinner from 'components/ui/Spinner'
import dynamic from 'next/dynamic'
import { FILES } from 'types/constants'
import styles from './index.module.scss'
import { useDetectOutsideClick } from 'components/hooks/useDetectOutsideClick'

const UserDropdownMenu = dynamic(()=>import('components/ui/UserDropdownMenu'), {ssr: false, loading: ()=> <Spinner size={24}/>},) 

interface Props {
  distanceFromTop: number
  
}

export default function Header(props: Props) {
  const userContext = useUserContext()
  const {profileType, setProfileType} = useUserContext()

  const [fromTop, setFromTop] = useState<number>(0)
  const [direction, setDirection] = useState<'up'|'down'>('up')
  const dropdownRef = useRef<HTMLDivElement>(null!)
  const [isDropDownOpen, setDropDownOpen] = useDetectOutsideClick(dropdownRef, false)

  const usrBtn = useRef<HTMLButtonElement>(null!)
  const cmpBtn = useRef<HTMLButtonElement>(null!)

  const router = useRouter()

  const regPath = '/registration'
  const loginPath = '/login'

  useEffect(()=>{
    if(props.distanceFromTop > fromTop) {
      setDirection('up')
      setFromTop(props.distanceFromTop)
    }
    else if(props.distanceFromTop < fromTop) {
      setDirection('down')
      setDropDownOpen(false)
      setFromTop(props.distanceFromTop)
    }
  
  }, [props.distanceFromTop])

  return ( 
    <div className={classnames(styles.root, styles[direction])} ref={dropdownRef}>
      <Image src={'/favicon.svg'} alt={'logo'} width={40} height={40}/>
      <div className={classnames(styles.contentWrapper, 'contentWrapper')}>
        {(!userContext.isLogged || !userContext.currentProfile) &&
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
        }

        <div className={styles.linksWrapper}>
          <Link className={styles.link} href={'/recruiting'} >Рекрутинг</Link>
          <Link className={styles.link} href={'/media'}>Медиа</Link>
          <Link className={styles.link} href={'/courses'}>Онлайн обучение</Link>
        </div>
        
        <div className={styles.userWrapper}>
          {!userContext.currentProfile && <>
            <Link className={classnames(styles.userLink, router.pathname === regPath&&styles.userLink_active)} href={'/registration'}><span>Регистрация</span></Link>
            <Link className={classnames(styles.userLink, router.pathname === loginPath&&styles.userLink_active)} href={'/login'}><span>Вход</span></Link>
          </>}

          {userContext.isLogged && userContext.currentProfile?.profileType === ProfileType.Employee && 
          <>
            <Link href={'/create/cv'} className={classnames(styles.userLink, styles.userLink_create)}><span>Создать резюме</span></Link>
            <UserPic image={userContext.currentProfile?.image&&FILES+userContext.currentProfile?.image.source} className={styles.userPic} onClick={()=> setDropDownOpen(!isDropDownOpen)}/>
          </>}

          {userContext.isLogged && userContext.currentProfile?.profileType === ProfileType.Hirer && 
          <>
            <Link href={'/create/vacancy'} className={classnames(styles.userLink, styles.userLink_create)}><span>Создать вакансию</span></Link>
            <UserPic image={userContext.currentProfile?.image&&FILES+userContext.currentProfile?.image.source} className={styles.userPic} onClick={()=> setDropDownOpen(!isDropDownOpen)}/>
          </>}
          {userContext.currentProfile &&
            <UserDropdownMenu       
            reference={(ref) => {dropdownRef.current = ref}}
            className={classnames(styles.dropdown, isDropDownOpen&&styles.dropdown_active)} 
            onClose={()=> setDropDownOpen(false)}
            />
          }
      </div>
      </div>
    </div>
  )
}