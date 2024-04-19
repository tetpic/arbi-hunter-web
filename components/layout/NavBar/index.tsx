import styles from './index.module.scss'
import MessageSvg from 'components/svg/MessageSvg'
import Link from 'next/link'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import { useUserContext } from 'context/user_state'
import Image from 'next/image'
import ArbiLogoTextSvg from '@/components/svg/ArbiLogoTextSvg'
import ChatFeedbackSvg from '@/components/svg/ChatFeedbackSvg'
import QuestionSvg from '@/components/svg/QuestionSvg'
import ShopSmallSvg from '@/components/svg/ShopSmallSvg'
import WalletSvg from '@/components/svg/WalletSvg'
import DocumentUserSvg from '@/components/svg/DocumentUserSvg'
import SettingSvg from '@/components/svg/SettingSvg'
import UserDoubleSvg from '@/components/svg/UserDoubleSvg'
import { ProfileType } from 'data/interfaces/IRegistration'
import ManSvg from '@/components/svg/ManSvg'
import Switch from '@/components/ui/Switch'
import { colors } from 'styles/variables'
import { useAppContext } from 'context/state'
import { AppTheme } from 'types/enums'
import ArbiCoinSvg from '@/components/svg/ArbiCoinSvg'
import P from '@/components/ui/P'
import useTranslation from 'next-translate/useTranslation'
import ExitSvg from '@/components/svg/ExitSvg'
import Button from '@/components/ui/Button'

interface Props {
}

export default function NavBar(props: Props) {
  const router = useRouter()
  const userContext = useUserContext()
  const appContext = useAppContext()
  const {t} = useTranslation()
  const profileType = userContext.currentProfile?.profileType

  const linksSet: {[key: string]: {path: string, query?: {page: string}, text: string, icon: JSX.Element}} = {
    cvs: {
      path: '/cvs',
      text: t('nav_myCvs'),
      icon: <DocumentUserSvg className={styles.linkSvg}/>
    },
    vacancies: {
      path: '/vacancies',
      text: t('nav_myVacancies'),
      icon: <DocumentUserSvg className={styles.linkSvg}/>
    },
    feedBacksEmp: {
      path: '/profile',
      query: {page: 'feedbacks'},
      text: t('nav_myFeedbacks'),
      icon: <ChatFeedbackSvg className={styles.linkSvg}/>
    },
    feedBacksHir: {
      path: '/responses',
      text: t('nav_myFeedbacks'),
      icon: <ChatFeedbackSvg className={styles.linkSvg}/>
    },
    messages: {
      path: '/messenger',
      text: t('nav_messenger'),
      icon: <MessageSvg className={styles.linkSvg}/>
    },
    shop: {
      path: '/shop',
      text: t('nav_shop'),
      icon: <ShopSmallSvg className={styles.linkSvg}/>
    },
    settings: {
      path: '/settings',
      text: t('nav_settings'),
      icon: <SettingSvg className={styles.linkSvg}/>
    },
    personality: {
      path: '/profile',
      query: {page: 'edit'},
      text: t('nav_character'),
      icon: <ManSvg className={styles.linkSvg}/>
    },
    managers: {
      path: '/managers',
      text: t('nav_managers'),
      icon: <UserDoubleSvg className={styles.linkSvg}/>
    },
    knowledge: {
      path: '/base',
      text: t('nav_knowlegdeBase'),
      icon: <QuestionSvg className={styles.linkSvg}/>
    }
  }

  const employeeLinks = [
    linksSet.cvs, 
    linksSet.feedBacksEmp, 
    linksSet.messages, 
    linksSet.shop, 
    linksSet.settings, 
    linksSet.personality, 
    linksSet.knowledge
  ]
  const hirerLinks = [
    linksSet.vacancies, 
    linksSet.messages, 
    linksSet.shop, 
    linksSet.settings, 
    linksSet.managers, 
    linksSet.knowledge
  ]
  
  const activePath = router.pathname
  const activeQuery = router.query

  if(!userContext.currentProfile) {
    return null
  }


  return ( <div className={styles.root} onMouseEnter={()=>appContext.setNavBarActive(true)} onMouseLeave={()=>appContext.setNavBarActive(false)}>
    <div className={styles.wrapper}>
        <Link href={'/'} className={styles.logo}>
          <Image  src={'/favicon.svg'} alt={'logo'} width={40} height={40}/>
          <ArbiLogoTextSvg className={styles.linkText}/>
        </Link>

        <Link aria-label='to shop'  className={classNames(styles.coloredLink, styles.link)} href={'/shop'}>
          <div className={classNames(styles.coloredIcon, styles.icon)}>
            <WalletSvg className={styles.linkSvg}/>
          </div>
          <P styleType={['alignCenter']}  className={classNames(styles.linkText, styles.money)}>{userContext.user?.balance} <ArbiCoinSvg/></P>
        </Link>

        {(profileType === ProfileType.Employee && employeeLinks
          ||
          profileType === ProfileType.Hirer && hirerLinks)
          .map((el, i)=> {
            return (
              <Link aria-label='to chats'  className={styles.link} href={{pathname: el.path, query: el.query}} key={el.path + i}>
                <Button className={styles.buttonIcon} altStyleType={['icon','white', 'invertSvg']} styleType={['icon', (activePath===el.path&&activeQuery?.page===el.query?.page&&styles.active)?'gradient':'black']} >
                  {el.icon}
                </Button>
                <P useThemeColor className={styles.linkText}>{el.text}</P>
              </Link>
            )
          })
        }
        <div 
        className={classNames(styles.exitButton, styles.link)}
        onClick={()=>userContext.logout()}
        >
          <Button className={styles.buttonIcon} styleType={['icon','black']} altStyleType={['icon','whitePurple']} >
            <ExitSvg/>
          </Button>
          <P useThemeColor className={styles.linkText}>{t('logout')}</P>
        </div>

        <div className={classNames(styles.linkText, styles.themeSwitcher)}>
          <P useThemeColor >Ночной режим</P>
          <Switch
          onChange={(val) => {appContext.setTheme(val ? AppTheme.Dark : AppTheme.Light)}}
          checked={appContext.theme ===AppTheme.Dark}
          offColor={colors.white}
          onColor={colors.blue}
          offHandleColor={colors.blue}
          onHandleColor={colors.white}
          width={50}
          />
        </div>
    </div>
  </div>
  )
}