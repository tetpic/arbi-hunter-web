import HomeSvg from 'components/svg/HomeSvg'
import MessageSvg from 'components/svg/MessageSvg'
import NotificationSvg from 'components/svg/NotificationSvg'
import WalletSvg from 'components/svg/WalletSvg'
import Link from 'next/link'
import styles from './index.module.scss'
import { useRouter } from 'next/router'
import classNames from 'classnames'

interface Props {
}

export default function NavBar(props: Props) {
  const router = useRouter()
  

  const activePath = router.pathname

  return ( <div className={styles.root}>
    <Link aria-label='go to main page' className={classNames(styles.link, activePath==='/'&&styles.active)} href={'/'}>
      <HomeSvg className={styles.linkSvg}/>
    </Link>

    <Link aria-label='to chats'  className={classNames( styles.link, activePath==='/messenger'&&styles.active)} href={'/messenger'}>
      <MessageSvg className={styles.linkSvg}/>
    </Link>

    <Link aria-label='to notifications'  className={classNames( styles.link, activePath==='/notifications'&&styles.active)} href={'/notifications'}>
      <NotificationSvg className={styles.linkSvg}/>
    </Link>

    <Link aria-label='tp payments'  className={classNames( styles.link, activePath==='/payments'&&styles.active)} href={'/payments'}>
      <WalletSvg className={styles.linkSvg}/>
    </Link>

  </div>
  )
}