import ArbiLogoTextSvg from 'components/svg/ArbiLogoTextSvg'
import styles from './index.module.scss'

import Image from 'next/image'
import MailConvertSvg from 'components/svg/MailConvertSvg'
import twitter from 'images/footer/footerTwitter.svg'
import facebook from 'images/footer/footerFaceBook.svg'
import insta from 'images/footer/footerInsta.svg'
import youtube from 'images/footer/footerYouTube.svg'
import Link from 'next/link'
import LockSvg from 'components/svg/LockSvg'
import WebMoneySvg from 'components/svg/WebMoneySvg'
import PayUSvg from 'components/svg/PayUSvg'
import QiwiSvg from 'components/svg/QiwiSvg'
import RoubleSvg from 'components/svg/RoubleSvg'
import background from 'images/footer/footerAHBackground.png'


interface Props {
}

export default function Footer(props: Props) {

  return (<div className={styles.root}> 
  <div className='contentWrapper'>
    <div className={styles.top}>
    <Image className={styles.background} src={background} alt={'back'} width={666} height={457}/>

      <div className={styles.left}>
        <div className={styles.logo}>
          <Image src={'/favicon.svg'} alt={'logo'} width={74} height={76}/>
          <ArbiLogoTextSvg/>
        </div>
        <p className={styles.mail}>
          <MailConvertSvg/>
          <Link href={'mailto:arbihanter@mail.com'} type='email'>arbihanter@mail.com</Link>
        </p>
        <p className={styles.desc}>
          Покупка трафика на&nbsp;одном ресурсе 
          и&nbsp;перенаправление на&nbsp;другой, 
          но&nbsp;за&nbsp;большую стоимость. 
          Проще говоря, арбитраж трафика работает так.
        </p>
        <div className={styles.links}>
          <Image src={facebook} alt={'fb'}/>
          <Image src={twitter} alt={'twitter'}/>
          <Image src={insta} alt={'insta'}/>
          <Image src={youtube} alt={'youtube'}/>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.column}>
          <p className={styles.title}>Соискателям</p>
          <p className={styles.link}>Список команд</p>
          <p className={styles.link}>Полезные статьи</p>
          <p className={styles.link}>Истории успеха</p>
          <p className={styles.link}>Истории успеха</p>
          <p className={styles.link}>Истории успеха</p>
          <p className={styles.link}>База знаний</p>
        </div>
        <div className={styles.column}>
          <p className={styles.title}>Работодателям</p>
          <p className={styles.link}>Список команд</p>
          <p className={styles.link}>Полезные статьи</p>
          <p className={styles.link}>Истории успеха</p>
          <p className={styles.link}>База знаний</p>
        </div>
        <div className={styles.column}>
          <p className={styles.title}>О сервисе</p>
          <p className={styles.link}>Список команд</p>
          <p className={styles.link}>Полезные статьи</p>
        </div>
      </div>
    </div>

    <div className={styles.bottom}>
      <p className={styles.license}>
        © 2023 All rights reserved
      </p>
      <div className={styles.payment}>
        <LockSvg/>
        Защищенная оплата:
        <WebMoneySvg/>
        <PayUSvg/>
        <QiwiSvg/>
        <RoubleSvg/>
      </div>
    </div >
  </div>
  </div>)
}