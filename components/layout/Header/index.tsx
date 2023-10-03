import styles from './index.module.scss'
import classnames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { ProfileType } from 'data/interfaces/IRegistration'
import { useRouter } from 'next/router'
import { useUserContext } from 'context/user_state'
import UserPic from 'components/ui/UserPic'
import Spinner from 'components/ui/Spinner'
import dynamic from 'next/dynamic'
import { FILES } from 'types/constants'

const UserDropdownMenu = dynamic(()=>import('components/ui/UserDropdownMenu'), {ssr: false, loading: ()=> <Spinner size={24}/>},) 

interface Props {
}

export default function Header(props: Props) {

  const userContext = useUserContext()

  const {profileType, setProfileType} = useUserContext()

  const [dropdown, handleDropdown] = useState<boolean>(false)

  const usrBtn = useRef<HTMLButtonElement>(null!)
  const cmpBtn = useRef<HTMLButtonElement>(null!)

  const router = useRouter()

  const regPath = '/registration'
  const loginPath = '/login'

  return ( 
    <div className={styles.root} >
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
            <Link className={classnames(styles.userLink, router.pathname === loginPath&&styles.userLink_active)} href={'/login'}>Вход</Link>
          </>}

          {userContext.isLogged && userContext.currentProfile?.profileType === ProfileType.Employee && 
          <>
            <Link href={'/create/cv'} className={classnames(styles.userLink, styles.userLink_create)}><span>Создать резюме</span></Link>
            <UserPic image={userContext.currentProfile?.image&&FILES+userContext.currentProfile.image.source} className={styles.userPic} onClick={()=> handleDropdown(!dropdown)}/>
          </>}

          {userContext.isLogged && userContext.currentProfile?.profileType === ProfileType.Hirer && 
          <>
            <Link href={'/create/vacancy'} className={classnames(styles.userLink, styles.userLink_create)}><span>Создать вакансию</span></Link>
            <UserPic image={userContext.currentProfile?.image&&FILES+userContext.currentProfile.image.source} className={styles.userPic} onClick={()=> handleDropdown(!dropdown)}/>
          </>}
          {dropdown &&
            <UserDropdownMenu className={styles.dropdown} onClose={()=> handleDropdown(false)}/>
          }
        </div>
      </div>
    </div>
  )
}