import styles from './index.module.scss'
import HomeSvg from 'components/svg/HomeSvg'
import MessageSvg from 'components/svg/MessageSvg'
import NotificationSvg from 'components/svg/NotificationSvg'
import WalletSvg from 'components/svg/WalletSvg'
import Link from 'next/link'

interface Props {
}

export default function NavBar(props: Props) {

  return ( <div className={styles.root}>
    <Link  className={styles.link} href={'/'}>
      <HomeSvg className={styles.linkSvg}/>
    </Link>

    <Link  className={styles.link} href={'/chats'}>
      <MessageSvg className={styles.linkSvg}/>
    </Link>

    <Link  className={styles.link} href={'/notifications'}>
      <NotificationSvg className={styles.linkSvg}/>
    </Link>

    <Link  className={styles.link} href={'/payments'}>
      <WalletSvg className={styles.linkSvg}/>
    </Link>

  </div>
  )
}