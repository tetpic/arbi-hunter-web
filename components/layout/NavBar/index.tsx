import HomeSvg from 'components/svg/HomeSvg'
import MessageSvg from 'components/svg/MessageSvg'
import NotificationSvg from 'components/svg/NotificationSvg'
import WalletSvg from 'components/svg/WalletSvg'
import Link from 'next/link'
import styles from './index.module.scss'

interface Props {
}

export default function NavBar(props: Props) {

  return ( <div className={styles.root}>
    <Link aria-label='go to main page' className={styles.link} href={'/'}>
      <HomeSvg className={styles.linkSvg}/>
    </Link>

    <Link aria-label='to chats'  className={styles.link} href={'/messenger'}>
      <MessageSvg className={styles.linkSvg}/>
    </Link>

    <Link aria-label='to notifications'  className={styles.link} href={'/notifications'}>
      <NotificationSvg className={styles.linkSvg}/>
    </Link>

    <Link aria-label='tp payments'  className={styles.link} href={'/payments'}>
      <WalletSvg className={styles.linkSvg}/>
    </Link>

  </div>
  )
}