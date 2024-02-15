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
import { getUserImageSource } from 'utils/helpers'
import SearchBar from '@/components/ui/SearchBar'
import NotificationSvg from '@/components/svg/NotificationSvg'
import HeartSvg from '@/components/svg/HeartSvg'

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
  const activePath = router.asPath
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
    <div className={classnames(styles.root, styles[direction], appContext.isNavBarActive&&styles.hoveredNavBar)} ref={dropdownRef}>
      {(!userContext.isLogged || !userContext.currentProfile) &&
      <Link href={userContext.currentProfile?'/profile':'/'} className={styles.logo}>
        <Image src={'/favicon.svg'} alt={'logo'} width={40} height={40}/>
      </Link>
      }
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

        {!isTabletWidth && userContext.isLogged && userContext.currentProfile?.profileType &&
          <div className={styles.linksWrapper}>
            <SearchBar onFilterClick={()=> {}}/>
            {/* <Link className={styles.link} href={'/recruiting'} >Рекрутинг</Link>
            <Link className={styles.link} href={'/media'}>Медиа</Link>
            <Link className={styles.link} href={'/courses'}>Онлайн обучение</Link> */}
          </div>
        }
        
        {!isTabletWidth && 
          <div className={styles.userWrapper}>
            {!userContext.currentProfile && <>
              <Button 
              styleType={['gradient']}
              href={regPath}
              disabled={activePath === regPath}
              >
                Регистрация
              </Button>

              <Button 
              styleType={['gradient']}
              disabled={activePath === loginPath}
              href={loginPath}
              >
                Вход
              </Button>
            </>}

            {userContext.isLogged && userContext.currentProfile?.profileType === ProfileType.Employee && 
            <>
              <Button 
              href={'/create/cv'} 
              styleType={['gradient']}
              >
                Создать резюме
              </Button>
              <Button               
              styleType={['icon', 'black']} 
              className={styles.iconButton}
              >
                <NotificationSvg/>
              </Button>
              <Button  
              styleType={['icon', 'black', 'svg24']} 
              className={styles.iconButton}
              href={'/favorites'}
              >
                <HeartSvg/>
              </Button>
              <UserPic 
              key={userContext.currentProfile?.logo?.source||userContext.currentProfile?.image?.source}
              image={getUserImageSource(userContext.currentProfile)} 
              className={styles.userPic} 
              onClick={()=>setDropDownOpen(state=> !state)}
              />
            </>}

            {userContext.isLogged && userContext.currentProfile?.profileType === ProfileType.Hirer && 
            <>
              <Button 
              href={'/create/vacancy'} 
              styleType={['gradient']}
              >
                Создать вакансию
              </Button>
              <Button 
              href={'/notifications'}
              styleType={['icon', 'black']} 
              className={styles.iconButton} 
              >
                <NotificationSvg/>
              </Button>
              <Button 
              styleType={['icon', 'black', 'svg24']} 
              className={classnames(styles.iconButton, activePath === '/profile?page=saved'&& styles.iconButton_active)} 
              href={'/favorites'}
              >
                <HeartSvg/>
              </Button>
              <UserPic 
              key={1} 
              image={userContext.currentProfile?.logo&&FILES+userContext.currentProfile?.logo.source} 
              className={styles.userPic} 
              onClick={()=>{setDropDownOpen(state=> !state)}}
              />
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