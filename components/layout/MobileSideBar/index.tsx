import styles from './index.module.scss'

import Link from 'next/link'
import classnames from 'classnames'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import { useEffect, useState } from 'react'
import Button from 'components/ui/Button'
import ArbiLogoTextSvg from '@/components/svg/ArbiLogoTextSvg'
import CrossSvg from '@/components/svg/CrossSvg'
import Image from 'next/image'
import UserPic from '@/components/ui/UserPic'
import { getUserImageSource, getUserName } from 'utils/helpers'
import P from '@/components/ui/P'
import ArrowRightSvg from '@/components/svg/ArrowRightSvg'
import FolderSvg from '@/components/svg/FolderSvg'
import ChatFeedbackSvg from '@/components/svg/ChatFeedbackSvg'
import MessageSvg from '@/components/svg/MessageSvg'
import ShopSmallSvg from '@/components/svg/ShopSmallSvg'
import SettingSvg from '@/components/svg/SettingSvg'
import ManSvg from '@/components/svg/ManSvg'
import QuestionSvg from '@/components/svg/QuestionSvg'
import { useRouter } from 'next/router'
import DocumentUserSvg from '@/components/svg/DocumentUserSvg'
import UserDoubleSvg from '@/components/svg/UserDoubleSvg'
import { Preset } from 'types/enums'

interface Props {
  onClose: ()=>void

}

export default function MobileSideBar(props: Props) {
  const userContext = useUserContext()
  const [active, setActive] = useState<boolean>(false)
  const router = useRouter()
  const profileType = userContext.currentProfile?.profileType||userContext.profileType||ProfileType.Employee


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
    <div className={styles.top}>
      <div className={styles.logo}>
        {!userContext.currentProfile  &&
        <>
          <Image src={'/favicon.svg'} alt={'logo'} width={32} height={32} />
          <ArbiLogoTextSvg />
        </>
        }
      </div>
      <Button styleType={['icon', 'backTransparent']} onClick={closeHandler}><CrossSvg/></Button>
    </div>

    {!userContext.currentProfile &&
    <>
      <Button 
      className={styles.button} 
      onClick={()=>{
        router.push('/registration')
        props.onClose()
      }} 
      styleType={['wide', 'gradient']}
      >
        Зарегистрироваться
      </Button>
      <Button 
      className={styles.button} 
      onClick={()=>{
        router.push('/login')
        props.onClose()
      }}
      styleType={['wide', 'black']}
      >
        Войти
      </Button>
    </>
    }

    {userContext.currentProfile &&<>
    <div 
    onClick={()=>{
      router.push('/personal/my')
      props.onClose()
    }} 
    className={styles.userCard}
    >
      <UserPic image={getUserImageSource(userContext.currentProfile, Preset.smallIconCrop)} size={64}/>
      <div className={styles.userCardContent}>
        <P styleType={['w500', 'medium']}>{getUserName(userContext.currentProfile)}</P>
        <P styleType={['w500', 'medium', 'greyLight']}>{userContext.currentProfile.profileType === ProfileType.Employee?'Соискатель':'Работодатель'}</P>
      </div>
      <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg/></Button>
    </div>

    <div className={styles.links}>

      {profileType === ProfileType.Employee &&
        <Link 
        href={{pathname: '/cvs'}} 
        onClick={props.onClose}
        className={styles.link}
        >
          <div className={styles.icon}><FolderSvg/></div>
          <P styleType={['w500', 'medium']}>Мои резюме</P>
          <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg/></Button>
        </Link>
      }

      {profileType === ProfileType.Hirer &&
        <Link 
        href={{
          pathname: '/vacancies',
        }} 
        onClick={props.onClose}
        className={styles.link}
        >
          <div className={styles.icon}><DocumentUserSvg/></div>
          <P styleType={['w500', 'medium']}>Мои вакансии</P>
          <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg/></Button>
        </Link>
      }

      {profileType === ProfileType.Employee &&
        <Link 
        href={{
          pathname: '/profile',
          query: {page: 'feedbacks'}
        }} 
        onClick={props.onClose}
        className={styles.link}
        >
          <div className={styles.icon}><ChatFeedbackSvg/></div>
          <P styleType={['w500', 'medium']}>Мои отклики</P>
          <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg/></Button>
        </Link>
      }
      <Link 
      href={'/messenger'} 
      onClick={props.onClose}
      className={styles.link}
      >
        <div className={styles.icon}><MessageSvg/></div>
        <P styleType={['w500', 'medium']}>Сообщения</P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg/></Button>
      </Link>
    </div>

    <div className={styles.links}>
      <Link 
      href={{pathname: '/shop'}} 
      onClick={props.onClose}
      className={styles.link}
      >
        <div className={styles.icon}><ShopSmallSvg/></div>
        <P styleType={['w500', 'medium']}>Магазин</P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg/></Button>
      </Link>

      <Link href={'/settings'} className={styles.link} onClick={props.onClose}>
        <div className={styles.icon}><SettingSvg/></div>
        <P styleType={['w500', 'medium']}>Настройки</P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg/></Button>
      </Link>
    </div>

    <div className={styles.links}>

      {profileType === ProfileType.Employee &&
        <Link 
        href={{
          pathname: '/profile',
          query: {page: 'edit'}
        }} 
        onClick={props.onClose}
        className={styles.link}
        >
          <div className={styles.icon}><ManSvg/></div>
          <P styleType={['w500', 'medium']}>Настройки персонажа</P>
          <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg/></Button>
        </Link>
      }
      {profileType === ProfileType.Hirer &&
        <Link 
        href={'/managers'} 
        onClick={props.onClose}
        className={styles.link}
        >
          <div className={styles.icon}><UserDoubleSvg/></div>
          <P styleType={['w500', 'medium']}>Менеджеры</P>
          <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg/></Button>
        </Link>
      }

      <Link href={'/base'} className={styles.link} onClick={props.onClose}>
        <div className={styles.icon}><QuestionSvg/></div>
        <P styleType={['w500', 'medium']}>База знаний</P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg/></Button>
      </Link>
    </div>
    </>}

    {userContext.currentProfile &&
      <P 
      styleType={['w500', 'medium', 'greyLight', 'alignStart']} 
      style={{width: '100%'}}
      >
        ИНФОРМАЦИЯ
      </P>
    }

    <div className={classnames(styles.links, styles.info)}>
      {profileType === ProfileType.Hirer &&
        <Link  href={userContext.currentProfile?'/create/vacancy/':'/login'} onClick={props.onClose} className={styles.link}>
          <P styleType={['w500', 'medium']}>Разместить вакансию</P>
          <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg/></Button>
        </Link>
      }
      {profileType === ProfileType.Employee &&
        <Link  href={userContext.currentProfile?'/create/cv/':'/login'} onClick={props.onClose} className={styles.link}>
          <P styleType={['w500', 'medium']}>Создать резюме</P>
          <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg/></Button>
        </Link>
      }

      <Link  href={'/services'} className={styles.link} onClick={props.onClose}>
        <P styleType={['w500', 'medium']}>Услуги</P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg/></Button>
      </Link>

      <Link  href={'/recruiting'} className={styles.link} onClick={props.onClose}>
        <P styleType={['w500', 'medium']}>
          {profileType === ProfileType.Hirer?'Поиск сотрудников':'Поиск работы'}
        </P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg/></Button>
      </Link>

      {profileType === ProfileType.Hirer &&
        <Link href={userContext.currentProfile?'/recruiting':'/login'} className={styles.link} onClick={props.onClose}>
          <P styleType={['w500', 'medium']}>Категории специалистов</P>
          <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg/></Button>
        </Link>
      }

      {!userContext.currentProfile &&
        <Link href={'/base'} className={styles.link} onClick={props.onClose}>
          <P styleType={['w500', 'medium']}>База знаний</P>
          <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg/></Button>
        </Link>    
      }

      <Link href={'/sitemap'} className={styles.link} onClick={props.onClose}>
        <P styleType={['w500', 'medium']}>Карта сайта</P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg/></Button>
      </Link>

      <Link className={styles.link} href={'/about'} onClick={props.onClose}>
        <P styleType={['w500', 'medium']}>О компании</P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg/></Button>
      </Link>
      
      <Link href={'/partners'} className={styles.link} onClick={props.onClose}>
        <P styleType={['w500', 'medium']}>Партнерам</P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg/></Button>
      </Link>

      <Link href={'/advertising'} className={styles.link} onClick={props.onClose}>
        <P styleType={['w500', 'medium']}>Реклама на сайте</P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg/></Button>
      </Link>

      <Link href={'/serviceterms'} className={styles.link} onClick={props.onClose}>
        <P styleType={['w500', 'medium']}>Условия оказания услуг</P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg/></Button>
      </Link>

      <Link href={'/useterms'} className={styles.link} onClick={props.onClose}>
        <P styleType={['w500', 'medium']}>Условия использования сайтов</P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg/></Button>
      </Link>

    </div>

    {userContext.currentProfile &&
      <Button 
      className={styles.button}
      styleType={['wide', 'black']}
      onClick={()=>userContext.logout()}
      >
        <P styleType={['red', 'w500', 'medium']}>Выйти</P>
      </Button>
    }
  </div>)
}