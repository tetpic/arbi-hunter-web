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
import HeadPhonesSvg from '@/components/svg/HeadPhonesSvg'
import ShopSmallSvg from '@/components/svg/ShopSmallSvg'

interface Props {
}

export default function NavBar(props: Props) {
  const router = useRouter()
  const userContext = useUserContext()
  

  const activePath = router.pathname

  return ( <div className={styles.root}>
    <div className={styles.wrapper}>
        <Link href={userContext.currentProfile?'/profile':'/'} className={styles.logo}>
          <Image  src={'/favicon.svg'} alt={'logo'} width={40} height={40}/>
          <ArbiLogoTextSvg className={styles.linkText}/>
        </Link>

        <Link aria-label='to chats'  className={styles.link} href={'/messenger'}>
          <div className={classNames(styles.icon, activePath==='/messenger'&&styles.active)}>
            <MessageSvg className={styles.linkSvg}/>
          </div>
          <p className={styles.linkText}>Сообщения</p>
        </Link>

        <Link aria-label='to notifications'  className={styles.link} href={'/notifications'}>
          <div className={classNames(styles.icon, activePath==='/notifications'&&styles.active)}>
            <ChatFeedbackSvg className={styles.linkSvg}/> 
          </div>
          <p className={styles.linkText}>Отклики</p>
        </Link>

        <Link aria-label='to notifications'  className={styles.link} href={'/notifications'}>
          <div className={classNames(styles.icon, activePath==='/notifications'&&styles.active)}>
            <ShopSmallSvg className={styles.linkSvg}/> 
          </div>
          <p className={styles.linkText}>Магазин</p>
        </Link>

        <Link aria-label='to notifications'  className={styles.link} href={'/notifications'}>
          <div className={classNames(styles.icon, activePath==='/notifications'&&styles.active)}>
            <HeadPhonesSvg className={styles.linkSvg}/> 
          </div>
          <p className={styles.linkText}>Поддержка</p>
        </Link>

        <Link aria-label='tp payments'  className={styles.link} href={'/payments'}>
          <div className={classNames(styles.icon,  activePath==='/payments'&&styles.active)}>          
            <QuestionSvg className={styles.linkSvg}/>
          </div>
          <p className={styles.linkText}>База знаний</p>
        </Link>
    </div>
  </div>
  )
}