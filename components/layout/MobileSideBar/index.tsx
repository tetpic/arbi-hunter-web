import styles from './index.module.scss'

import Link from 'next/link'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import BackBtn from 'components/ui/BackBtn'
import { useEffect, useState } from 'react'

interface Props {
  onClose: ()=>void

}

export default function MobileSideBar(props: Props) {
  const userContext = useUserContext()
  const {profileType, setProfileType} = userContext
  const [active, setActive] = useState<boolean>(false)

  const router = useRouter()
  const regPath = '/registration'
  const loginPath = '/login'

  const closeHandler = () => {
    setActive(false)
    setTimeout(()=> {
      props.onClose()
    }, 300)
  }

  useEffect(()=>{
    setTimeout(() => {
      setActive(true)
    }, 20)
  }, [])



  return (
  <div className={classnames(styles.root, active&&styles.active) }> 
    <BackBtn className={styles.backBtn} onClick={closeHandler} bgColor={'transparent'}/>
    <div className={styles.wrapper}>
      {!userContext.isLogged && <div className={styles.reg}>
        <Link onClick={closeHandler} className={styles.link} href={'/registration'}><span>Регистрация</span></Link>
        <Link onClick={closeHandler} className={styles.link} href={'/login'}><span>Вход</span></Link>
      </div>}
      <Link onClick={closeHandler} className={styles.link} href={'/recruiting'} >Рекрутинг</Link>
      <Link onClick={closeHandler} className={styles.link} href={'/media'}>Медиа</Link>
      <Link onClick={closeHandler} className={styles.link} href={'/courses'}>Онлайн обучение</Link>

      {userContext.isLogged && userContext.currentProfile?.profileType === ProfileType.Employee && 
        <Link href={'/create/cv'} className={styles.link}><span>Создать резюме</span></Link>
      }

      {userContext.isLogged && userContext.currentProfile?.profileType === ProfileType.Hirer && 
        <Link href={'/create/vacancy'} className={styles.link}><span>Создать вакансию</span></Link>
      }

    </div>


  </div>)
}