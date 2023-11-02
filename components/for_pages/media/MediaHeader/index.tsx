import styles from './index.module.scss'

import Image from 'next/image'
import rightImage from 'images/media_right.png'
import leftImage from 'images/media-left.png'
import mobileImage from 'images/mediaLandingImageMobile.png'
import Link from 'next/link'
import { useResize } from 'components/hooks/useResize'



interface Props {
  isMobile?: boolean
}

export default function MediaPageHeader(props: Props) {
  const {isTabletWidth} = useResize()

  return (
  <div className={styles.header}>
    {isTabletWidth &&props.isMobile &&
      <Image className={styles.image} src={mobileImage} alt={'landing image'} width={307} height={222}/>
    ||
      <>
        <Image className={styles.image_left} src={leftImage} alt={'left item image'} width={225} height={292}/>
        <Image className={styles.image_right} src={rightImage} alt={'left item image'} width={283} height={292}/>
      </>
    }
    <div className={styles.content}>
      <h1 className={styles.title}>Присоединяйся к комьюнити <br /> <span className={styles.title_purple}>Arbi</span> <span className={styles.title_white}>Hunter</span></h1>
      <p className={styles.text}>Зарегистрируйся и получи доступ к подпискам на сообщества, сохраняйте статьи, подписывайтесь на новости</p>
    </div>
    <Link className={styles.registerButton} href={'/registration'}><span>Зарегистрироваться</span></Link>
  </div>)
}