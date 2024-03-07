import styles from './index.module.scss'

import ArbiLogoTextSvg from 'components/svg/ArbiLogoTextSvg'
import Image from 'next/image'
import MailConvertSvg from 'components/svg/MailConvertSvg'
import twitter from 'images/footer/twitter_footer.svg'
import insta from 'images/footer/instagram_footer.svg'
import youtube from 'images/footer/youtube_footer.svg'
import linkedIn from 'images/footer/linkedIn_footer.svg'
import telegram from 'images/footer/tg_footer.svg'
import qrCode from 'images/footer/qrCode.svg'
import Link from 'next/link'
import LockSvg from 'components/svg/LockSvg'
import UahSvg from '@/components/svg/UahSvg'
import RurSvg from '@/components/svg/RurSvg'
import UsdSvg from '@/components/svg/UsdSvg'
import BtcSvg from '@/components/svg/BtcSvg'
import EuroSvg from '@/components/svg/EuroSvg'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'


interface Props {
}

export default function Footer(props: Props) {
  const userContext = useUserContext()

  return (<div className={styles.root}> 
  <div className='contentWrapper'>
    <div className={styles.top}>
    <Image className={styles.background} src={'/images/ahFooter.svg'} alt={'back'} width={666} height={457}/>

      <div className={styles.left}>
        <div className={styles.logo}>
          <Image src={'/favicon.svg'} alt={'logo'} width={74} height={76}/>
          <ArbiLogoTextSvg/>
        </div>
        <p className={styles.mail}>
          <MailConvertSvg/>
          <Link href={'mailto:arbihunter@mail.com'} type='email'>arbihunter@mail.com</Link>
        </p>
        <div className={styles.links}>
          <Image src={twitter} alt={'twitter'}/>
          <Image src={insta} alt={'insta'}/>
          <Image src={youtube} alt={'youtube'}/>
          <Image src={telegram} alt={'telegram'}/>
          <Image src={linkedIn} alt={'linkedIn'}/>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.column}>
          {/* <p className={styles.title}>О компании</p> */}
          <Link className={styles.link} href={'/about'}>О компании</Link>
          <Link href={'/partners'} className={styles.link}>Партнерам</Link>
          <Link href={'/advertising'} className={styles.link}>Реклама на сайте</Link>
          <Link href={'/serviceterms'} className={styles.link}>Условия оказания услуг</Link>
          <Link href={'/useterms'} className={styles.link}>Условия использования сайтов</Link>
        </div>
        <div className={styles.column}>
          {/* <p className={styles.title}>Работодателям</p> */}
          {userContext.profileType === ProfileType.Employee && 
          <>
            <Link href={userContext.currentProfile?'/create/cv/':'/login'} className={styles.link}>Создать резюме</Link>
            <Link href={'/recruiting'}  className={styles.link}>Поиск работы</Link>
            <Link href={userContext.currentProfile?'/recruiting':'/login'} className={styles.link}>Каталог вакансий</Link>
          </>
          }
          {userContext.profileType === ProfileType.Hirer &&
          <>
            <Link href={userContext.currentProfile?'/create/vacancy/':'/login'} className={styles.link}>Разместить вакансию</Link>
            <Link href={'/recruiting'} className={styles.link}>Поиск сотрудников</Link>
            <Link href={userContext.currentProfile?'/recruiting':'/login'} className={styles.link}>Категории специалистов</Link>
          </>
          }

          <Link href={'/services'} className={styles.link}>Услуги</Link>
        </div>
        <div className={styles.column}>
          {/* <p className={styles.title}>О сервисе</p> */}
          <Link href={'/base'} className={styles.link}>База знаний</Link>
          <Link href={'/sitemap'} className={styles.link}>Карта сайта</Link>
        </div>

        <div className={styles.qrCode}>
          <p className={styles.link}>
            Скачать приложение <br /> в Google play <br /> или AppStore
          </p>
          <Image src={qrCode} alt={'qrCode'} />
        </div>
      </div>
    </div>

    <div className={styles.bottom}>
      <p className={styles.license}>
        © {new Date().getFullYear()} All rights reserved
      </p>
      <div className={styles.payment}>
        <LockSvg/>
        Защищенная оплата:
        <UahSvg/>
        <RurSvg/>
        <UsdSvg/>
        <BtcSvg/>
        <EuroSvg/>
      </div>
    </div >
  </div>
  </div>)
}