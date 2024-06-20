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
import ShopSmallSvg from '@/components/svg/ShopSmallSvg'
import SettingSvg from '@/components/svg/SettingSvg'
import ManSvg from '@/components/svg/ManSvg'
import QuestionSvg from '@/components/svg/QuestionSvg'
import { useRouter } from 'next/router'
import DocumentUserSvg from '@/components/svg/DocumentUserSvg'
import UserDoubleSvg from '@/components/svg/UserDoubleSvg'
import { Preset } from 'types/enums'
import StarSvg from '@/components/svg/StarSvg'
import HeartSvg from '@/components/svg/HeartSvg'
import { useAppContext } from 'context/state'
import { colors } from 'styles/variables'
import useTranslation from 'next-translate/useTranslation'
import Formatter from 'utils/formatter'
import ArbiCoinSvg from '@/components/svg/ArbiCoinSvg'
import SupportSvg from '@/components/svg/SupportSvg'

interface Props {
  onClose: ()=>void

}

export default function MobileSideBar(props: Props) {
  const {t} = useTranslation()
  const userContext = useUserContext()
  const appContext = useAppContext()
  const [active, setActive] = useState<boolean>(false)
  const router = useRouter()
  const isLogged = userContext.isLogged
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
      <Button  altStyleType={['invertSvg']} onClick={closeHandler}><CrossSvg/></Button>
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
        {t('registration_getRegister')}
      </Button>
      <Button 
      className={styles.button} 
      onClick={()=>{
        router.push('/login')
        props.onClose()
      }}
      styleType={['wide', 'black']}
      altStyleType={['wide', 'whitePurple']}
      >
        {t('enter')}
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
      <UserPic image={getUserImageSource(userContext.currentProfile, Preset.smallIconCrop)} straightSizes size={64}/>
      <div className={styles.userCardContent}>
        <P useThemeColor styleType={['w500', 'medium']} className={styles.name}>{getUserName(userContext.currentProfile)}</P>
        <P 
        styleType={['w500', 'medium', 'greyLight']}
        >
          {userContext.currentProfile?.profileType === ProfileType.Employee?t('employee'):t('hirer_alt')}
        </P>
      </div>
      <Button styleType={['icon', 'backTransparent']}  className={styles.arrow}><ArrowRightSvg color={colors.greyLight}/></Button>
    </div>

    <Link 
    onClick={props.onClose}
    href={'/shop'}
    className={classnames(styles.links, styles.balanceLink)}>
      <P style={{gridArea: 't'}} styleType={['w500', 'medium']} >{t('shop_profileBalance')}</P>
      <P style={{gridArea: 'm'}} styleType={['w800', 'fs20', 'alignCenter']}><ArbiCoinSvg/> {Formatter.formatPrice(userContext.user.balance)||0}</P>
      <Button styleType={['grey', 'whiteText']}  className={styles.fillbutton}>{t('shop_fill')} <ArrowRightSvg/></Button>

    </Link>

    <div className={styles.links}>

      {profileType === ProfileType.Employee &&
        <Link 
        href={{pathname: '/cvs'}} 
        onClick={props.onClose}
        className={styles.link}
        >
          <div className={styles.icon}><FolderSvg/></div>
          <P useThemeColor styleType={['w500', 'medium']}>{t('nav_myCvs')}</P>
          <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg color={colors.greyLight}/></Button>
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
          <P useThemeColor styleType={['w500', 'medium']}>{t('nav_myVacancies')}</P>
          <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg color={colors.greyLight}/></Button>
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
          <P useThemeColor styleType={['w500', 'medium']}>{t('nav_myFeedbacks')}</P>
          <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg color={colors.greyLight}/></Button>
        </Link>
      }

      <Link 
      href={'/favorites'} 
      onClick={props.onClose}
      className={styles.link}
      >
        <div className={styles.icon}>{profileType === ProfileType.Hirer?<StarSvg/>:<HeartSvg/>}</div>
        <P useThemeColor styleType={['w500', 'medium']}>{t('favorites_title')}</P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg color={colors.greyLight}/></Button>
      </Link>
    </div>

    <div className={styles.links}>
      <Link href={'/settings'} className={styles.link} onClick={props.onClose}>
        <div className={styles.icon}><SettingSvg/></div>
        <P useThemeColor styleType={['w500', 'medium']}>{t('settings')}</P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg color={colors.greyLight}/></Button>
      </Link>

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
          <P useThemeColor styleType={['w500', 'medium']}>{t('nav_modelSettings')}</P>
          <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg color={colors.greyLight}/></Button>
        </Link>
      }
      {profileType === ProfileType.Hirer &&
        <Link 
        href={'/managers'} 
        onClick={props.onClose}
        className={styles.link}
        >
          <div className={styles.icon}><UserDoubleSvg/></div>
          <P useThemeColor styleType={['w500', 'medium']}>{t('nav_managers')}</P>
          <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg color={colors.greyLight}/></Button>
        </Link>
      }
    </div>

    <div className={styles.links}>
      <Link href={'/base'} className={styles.link} onClick={props.onClose}>
        <div className={styles.icon}><QuestionSvg/></div>
        <P useThemeColor styleType={['w500', 'medium']}>{t('nav_knowlegdeBase')}</P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg color={colors.greyLight}/></Button>
      </Link>

      <Link 
      href={{pathname: '/shop'}} 
      onClick={props.onClose}
      className={styles.link}
      >
        <div className={styles.shopicon}><ShopSmallSvg color={colors.blue}/></div>
        <P useThemeColor styleType={['w500', 'medium', 'blue']}>{t('nav_shop')}</P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg color={colors.blue}/></Button>
      </Link>

      <Link 
      href={{pathname: 'https://t.me/arbihunter_support'}} 
      onClick={props.onClose}
      className={styles.link}
      >
        <div className={styles.shopicon}><SupportSvg/></div>
        <P useThemeColor styleType={['w500', 'medium']}>Техподдержка</P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg/></Button>
      </Link>
    </div>

    {/* 
    //  НЕ УДАЛЯТЬ! Это переключение светлой и темной темы
    <div className={styles.links}>
      <div className={styles.link}>
        <div className={styles.icon}><DayNightSvg/></div>
        <P useThemeColor  styleType={['w500', 'medium']} >{t('nav_nightMode')}</P>
        <div className={styles.arrow}>

          <Switch
          onChange={(val) => {appContext.setTheme(val ? AppTheme.Dark : AppTheme.Light)}}
          checked={appContext.theme ===AppTheme.Dark}
          offColor={colors.purpleGrey}
          onColor={colors.blue}
          offHandleColor={colors.blue}
          onHandleColor={colors.white}
          width={50}
          />
        </div>
      </div>
    </div> */}
    </>}

    {!isLogged &&
      <P 
      styleType={['w500', 'medium', 'greyLight', 'alignStart']} 
      style={{width: '100%'}}
      >
        {t('nav_infofmation')}
      </P>
    }

    {!isLogged &&
    <div className={classnames(styles.links, styles.info)}>
      {profileType === ProfileType.Hirer &&
        <Link  href={userContext.currentProfile?'/create/vacancy/':'/login'} onClick={props.onClose} className={styles.link}>
          <P useThemeColor styleType={['w500', 'medium']}>{t('footer_createVc')}</P>
          <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg color={colors.greyLight}/></Button>
        </Link>
      }
      {profileType === ProfileType.Employee &&
        <Link  href={userContext.currentProfile?'/create/cv/':'/login'} onClick={props.onClose} className={styles.link}>
          <P useThemeColor styleType={['w500', 'medium']}>{t('footer_createCv')}</P>
          <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg color={colors.greyLight}/></Button>
        </Link>
      }

      <Link  href={'/services'} className={styles.link} onClick={props.onClose}>
        <P  useThemeColor styleType={['w500', 'medium']}>{t('footer_services')}</P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg color={colors.greyLight}/></Button>
      </Link>

      <Link  href={'/recruiting'} className={styles.link} onClick={props.onClose}>
        <P useThemeColor styleType={['w500', 'medium']}>
          {profileType === ProfileType.Hirer?t('footer_findCandidates'):t('footer_findJobs')}
        </P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg color={colors.greyLight}/></Button>
      </Link>

      {profileType === ProfileType.Hirer &&
        <Link href={userContext.currentProfile?'/recruiting':'/login'} className={styles.link} onClick={props.onClose}>
          <P useThemeColor styleType={['w500', 'medium']}>{t('footer_candidatesCategories')}</P>
          <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg color={colors.greyLight}/></Button>
        </Link>
      }

      {!userContext.currentProfile &&
        <Link href={'/base'} className={styles.link} onClick={props.onClose}>
          <P useThemeColor styleType={['w500', 'medium']}>{t('footer_knowledgeBase')}</P>
          <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg color={colors.greyLight}/></Button>
        </Link>    
      }

      <Link href={'/sitemap'} className={styles.link} onClick={props.onClose}>
        <P useThemeColor styleType={['w500', 'medium']}>{t('footer_siteMap')}</P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg color={colors.greyLight}/></Button>
      </Link>

      <Link className={styles.link} href={'/about'} onClick={props.onClose}>
        <P useThemeColor styleType={['w500', 'medium']}>{t('footer_about')}</P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg color={colors.greyLight}/></Button>
      </Link>
      
      <Link href={'/partners'} className={styles.link} onClick={props.onClose}>
        <P useThemeColor styleType={['w500', 'medium']}>{t('footer_forPartners')}</P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg color={colors.greyLight}/></Button>
      </Link>

      <Link href={'/advertising'} className={styles.link} onClick={props.onClose}>
        <P useThemeColor styleType={['w500', 'medium']}>{t('footer_advertisement')}</P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg color={colors.greyLight}/></Button>
      </Link>

      <Link href={'/rules'} className={styles.link} onClick={props.onClose}>
        <P useThemeColor styleType={['w500', 'medium']}>{t('footer_serviceTerms')}</P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg color={colors.greyLight}/></Button>
      </Link>

      <Link href={'/privacy'} className={styles.link} onClick={props.onClose}>
        <P useThemeColor styleType={['w500', 'medium']}>{t('footer_useTerms')}</P>
        <Button styleType={['icon', 'backTransparent']} className={styles.arrow}><ArrowRightSvg color={colors.greyLight}/></Button>
      </Link>

    </div>
    } 

    {userContext.currentProfile &&
      <Button 
      altStyleType={['wide', 'whitePurple']}
      className={styles.button}
      styleType={['wide', 'black']}
      onClick={()=>userContext.logout()}
      >
        <P styleType={['red', 'w500', 'medium']}>{t('logout')}</P>
      </Button>
    }
  </div>)
}