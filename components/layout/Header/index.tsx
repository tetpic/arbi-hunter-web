import styles from './index.module.scss'

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
import { useDetectOutsideClick } from 'components/hooks/useDetectOutsideClick'
import Modes from 'components/ui/Modes'
import { useResize } from 'components/hooks/useResize'
import MenuButtonSvg from 'components/svg/MenuButtonSvg'
import Button from 'components/ui/Button'
import { useAppContext } from 'context/state'
import { ModalType } from 'types/enums'

const UserDropdownMenu = dynamic(()=>import('components/ui/UserDropdownMenu'), {ssr: false, loading: ()=> <Spinner size={24}/>},) 

interface Props {
  distanceFromTop: number
}

export default function Header(props: Props) {
  const userContext = useUserContext()
  const appContext = useAppContext()
  const {profileType, setProfileType} = userContext
  const {isTabletWidth} = useResize()

  const [fromTop, setFromTop] = useState<number>(0)
  const [direction, setDirection] = useState<'up'|'down'>('up')
  const dropdownRef = useRef<HTMLDivElement>(null!)
  const [isDropDownOpen, setDropDownOpen] = useDetectOutsideClick(dropdownRef, false)

  /*очень странный сайд эффект... 
  что при смене профиля, 
  когда появляется currentProfile, 
  useState становится почему-то true */
  useEffect(()=>{
    setDropDownOpen(false)
  }, [userContext.currentProfile])

  const router = useRouter()
  const regPath = '/registration'
  const loginPath = '/login'

  useEffect(()=>{
    if(!isTabletWidth) {

      if(props.distanceFromTop > fromTop && props.distanceFromTop <= -40) {
        setDirection('up')
        setFromTop(props.distanceFromTop)
      }
      else if(props.distanceFromTop < fromTop && props.distanceFromTop <= -40) {
        setDirection('down')
        !isTabletWidth && setDropDownOpen(false)
        setFromTop(props.distanceFromTop)
      }
      else {
        setDirection('up')
      }
    }
  }, [props.distanceFromTop])

  return ( 
    <div className={classnames(styles.root, styles[direction])} ref={dropdownRef}>
      <Link href={'/'}>
        <Image src={'/favicon.svg'} alt={'logo'} width={40} height={40}/>
      </Link>
      <div className={classnames(styles.contentWrapper, 'contentWrapper')}>
        {(!userContext.isLogged || !userContext.currentProfile) &&
          <Modes 
          buttons={[
            {name: 'Соискатель', type: ProfileType.Employee},
            {name: 'Компания', type: ProfileType.Hirer}
          ]} 
          activeButton={profileType} 
          onSet={(type)=>setProfileType(type)}/>
        }

        {!isTabletWidth &&
          <div className={styles.linksWrapper}>
            <Link className={styles.link} href={'/recruiting'} >Рекрутинг</Link>
            <Link className={styles.link} href={'/media'}>Медиа</Link>
            <Link className={styles.link} href={'/courses'}>Онлайн обучение</Link>
          </div>
        }
        
        {!isTabletWidth &&
          <div className={styles.userWrapper}>
            {!userContext.currentProfile && <>
              <Link className={classnames(styles.userLink, router.pathname === regPath&&styles.userLink_active)} href={'/registration'}><span>Регистрация</span></Link>
              <Link className={classnames(styles.userLink, router.pathname === loginPath&&styles.userLink_active)} href={'/login'}><span>Вход</span></Link>
            </>}

            {userContext.isLogged && userContext.currentProfile?.profileType === ProfileType.Employee && 
            <>
              <Link href={'/create/cv'} className={classnames(styles.userLink, styles.userLink_create)}><span>Создать резюме</span></Link>
              <UserPic image={userContext.currentProfile?.image&&FILES+userContext.currentProfile?.image.source} className={styles.userPic} onClick={()=>setDropDownOpen(state=> !state)}/>
            </>}

            {userContext.isLogged && userContext.currentProfile?.profileType === ProfileType.Hirer && 
            <>
              <Link href={'/create/vacancy'} className={classnames(styles.userLink, styles.userLink_create)}><span>Создать вакансию</span></Link>
              <UserPic key={1} image={userContext.currentProfile?.image&&FILES+userContext.currentProfile?.image.source} className={styles.userPic} onClick={()=>{setDropDownOpen(state=> !state)}}/>
            </>}
            {userContext.currentProfile &&
              <UserDropdownMenu       
              reference={(ref) => {dropdownRef.current = ref}}
              className={classnames(styles.dropdown, isDropDownOpen&&styles.dropdown_active)} 
              onClose={()=> {setDropDownOpen(false)}}
              />
            }
          </div>
          ||
          <>
          <Button onClick={()=>{appContext.showModal(ModalType.MobileSideBarModal)}}><MenuButtonSvg/></Button>
          </>
        }
      </div>
    </div>
  )
}