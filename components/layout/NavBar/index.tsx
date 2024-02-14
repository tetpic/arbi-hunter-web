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
import Button from '@/components/ui/Button'

interface Props {
}

export default function NavBar(props: Props) {
  const router = useRouter()
  const userContext = useUserContext()
  const appContext = useAppContext()
  const profileType = userContext.currentProfile.profileType

  const linksSet: {[key: string]: {path: string, query?: {page: string}, text: string, icon: JSX.Element}} = {
    cvs: {
      path: '/profile',
      query: {page: 'cvs'},
      text: 'Мои резюме',
      icon: <DocumentUserSvg className={styles.linkSvg}/>
    },
    vacancies: {
      path: '/profile',
      query: {page: 'vacancies'},
      text: 'Мои вакансии',
      icon: <DocumentUserSvg className={styles.linkSvg}/>
    },
    feedBacksEmp: {
      path: '/profile',
      query: {page: 'feedbacks'},
      text: 'Мои отклики',
      icon: <ChatFeedbackSvg className={styles.linkSvg}/>
    },
    feedBacksHir: {
      path: '/responses',
      text: 'Мои отклики',
      icon: <ChatFeedbackSvg className={styles.linkSvg}/>
    },
    messages: {
      path: '/messenger',
      text: 'Сообщения',
      icon: <MessageSvg className={styles.linkSvg}/>
    },
    shop: {
      path: '/profile',
      query: {page: 'shop'},
      text: 'Магазин',
      icon: <ShopSmallSvg className={styles.linkSvg}/>
    },
    settings: {
      path: '/settings',
      text: 'Настройки',
      icon: <SettingSvg className={styles.linkSvg}/>
    },
    personality: {
      path: '/profile',
      query: {page: 'edit'},
      text: 'Персонаж',
      icon: <ManSvg className={styles.linkSvg}/>
    },
    managers: {
      path: '/managers',
      text: 'Менеджеры',
      icon: <UserDoubleSvg className={styles.linkSvg}/>
    },
    knowledge: {
      path: '/base',
      text: 'База знаний',
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


  return ( <div className={styles.root} onMouseEnter={()=>appContext.setNavBarActive(true)} onMouseLeave={()=>appContext.setNavBarActive(false)}>
    <div className={styles.wrapper}>
        <Link href={'/'} className={styles.logo}>
          <Image  src={'/favicon.svg'} alt={'logo'} width={40} height={40}/>
          <ArbiLogoTextSvg className={styles.linkText}/>
        </Link>

        <Link aria-label='to chats'  className={classNames(styles.coloredLink, styles.link)} href={'/profile?page=shop'}>
          <div className={classNames(styles.coloredIcon, styles.icon)}>
            <WalletSvg className={styles.linkSvg}/>
          </div>
          <p className={classNames(styles.linkText, styles.money)}>12 500 $</p>
        </Link>

        {(profileType === ProfileType.Employee && employeeLinks
          ||
          profileType === ProfileType.Hirer && hirerLinks)
          .map((el, i)=> {
            return (
              <Link aria-label='to chats'  className={styles.link} href={{pathname: el.path, query: el.query}} key={el.path + i}>
                <div className={classNames(styles.icon, activePath===el.path&&activeQuery?.page===el.query?.page&&styles.active)}>
                  {el.icon}
                </div>
                <p className={styles.linkText}>{el.text}</p>
              </Link>
            )
          })
        }
        <Button styleType={['black', 'icon']} href={'/recruiting'}>R</Button>

        <div className={classNames(styles.linkText, styles.themeSwitcher)}>
          <p >Ночной режим</p>
          <Switch
          onChange={(val) => {}}
          checked={true}
          offColor={colors.white}
          onColor={colors.yellow}
          offHandleColor={colors.yellow}
          onHandleColor={colors.white}
          width={50}
          />
        </div>
    </div>
  </div>
  )
}