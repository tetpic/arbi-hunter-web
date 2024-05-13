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
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import P from '@/components/ui/P'
import { useAppContext } from 'context/state'
import { AppTheme } from 'types/enums'
import classNames from 'classnames'
import { colors } from 'styles/variables'
import useTranslation from 'next-translate/useTranslation'


interface Props {
}

export default function Footer(props: Props) {
  const {t} = useTranslation()
  const userContext = useUserContext()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const isLightTheme = appContext.theme === AppTheme.Light

  return (<div className={styles.root}> 
  <div className='contentWrapper'>
    <div className={styles.top}>
    <Image 
    className={classNames(styles.background, isLightTheme && styles.background_light)} 
    src={'/images/ahFooter.svg'} alt={'back'} 
    width={666} 
    height={457}/>

      <div className={styles.left}>
        {!isTabletWidth &&
        <div className={classNames(styles.logo, isLightTheme && styles.logo_light)}>
            <Image src={'/favicon.svg'} alt={'logo'} width={74} height={76}/>
            <ArbiLogoTextSvg/>
        </div>
        }
        <P styleType={['large', 'w600', 'alignCenter']} useThemeColor className={styles.mail}>
          <MailConvertSvg color={isLightTheme&&colors.black}/>
          <Link href={'mailto:support@arbihunter.com'} type='email'>support@arbihunter.com</Link>
        </P>
        <div className={styles.links}>
          <Image src={twitter} alt={'twitter'}/>
          <Image src={insta} alt={'insta'}/>
          <Image src={youtube} alt={'youtube'}/>
          <Link href={'https://t.me/arbihunter'}>
            <Image src={telegram} alt={'telegram'}/>
          </Link>
          <Image src={linkedIn} alt={'linkedIn'}/>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.column}>
          <Link  href={'/about'}>
            <P  styleType={['medium', 'w500']} useThemeColor>{t('footer_about')}</P>
          </Link>
          <Link href={'/partners'}>
            <P styleType={['medium', 'w500']} useThemeColor>{t('footer_forPartners')}</P>
          </Link>
          <Link href={'/advertising'}>
            <P styleType={['medium', 'w500']} useThemeColor>{t('footer_advertisement')}</P>
          </Link>
          <Link href={'/serviceterms'}>
            <P styleType={['medium', 'w500']} useThemeColor>{t('footer_serviceTerms')}</P>
          </Link>
          <Link href={'/useterms'}>
            <P styleType={['medium', 'w500']} useThemeColor>{t('footer_useTerms')}</P>
          </Link>
        </div>
        <div className={styles.column}>
          {userContext.profileType === ProfileType.Employee && 
          <>
            <Link href={userContext.currentProfile?'/create/cv/':'/login'}>
              <P styleType={['medium', 'w500']} useThemeColor>{t('create_cv')}</P>
            </Link>
            <Link href={'/recruiting'}>
              <P styleType={['medium', 'w500']} useThemeColor>{t('footer_findJobs')}</P>
            </Link>
            <Link href={userContext.currentProfile?'/recruiting':'/login'}>
              <P styleType={['medium', 'w500']} useThemeColor>{t('footer_vcCatalog')}</P>
            </Link>
          </>
          }
          {userContext.profileType === ProfileType.Hirer &&
          <>
            <Link href={userContext.currentProfile?'/create/vacancy/':'/login'} >
              <P styleType={['medium', 'w500']} useThemeColor>{t('footer_createVc')}</P>
            </Link>
            <Link href={'/recruiting'} >
              <P styleType={['medium', 'w500']} useThemeColor>{t('footer_findCandidates')}</P>
            </Link>
            <Link href={userContext.currentProfile?'/recruiting':'/login'} >
              <P styleType={['medium', 'w500']} useThemeColor>{t('footer_candidatesCategories')}</P>
            </Link>
          </>
          }

          <Link href={'/services'}>
            <P styleType={['medium', 'w500']} useThemeColor>{t('footer_services')}</P>
          </Link>
        </div>
        <div className={styles.column}>
          <Link href={'/base'} >
            <P styleType={['medium', 'w500']} useThemeColor>{t('footer_knowledgeBase')}</P>
          </Link>
          <Link href={'/sitemap'} >
            <P styleType={['medium', 'w500']} useThemeColor>{t('footer_siteMap')}</P>
          </Link>
        </div>

        {!isTabletWidth &&
        <div className={classNames(styles.qrCode, isLightTheme&&styles.qrCode_light)}>
          <P styleType={['medium', 'w500']} useThemeColor>
            {t('footer_download1')} <br /> {t('footer_download2')} <br /> {t('footer_download3')}
          </P>
          <Image src={qrCode} alt={'qrCode'} width={100} height={100} />
        </div>
        }
      </div>
    </div>

    {!isTabletWidth &&
    <div className={classNames(styles.bottom, isLightTheme&&styles.bottom_light)}>
      <p className={styles.license}>
        © {new Date().getFullYear()} All rights reserved
      </p>
      <div className={styles.payment}>
        <LockSvg color={isLightTheme&&colors.black}/>
        <P styleType={['medium', 'w500']} useThemeColor>{t('footer_securePayment')}:</P>
        <P styleType={['huge', 'w600']} className={styles.paymentMethod}>₴</P>
        <P styleType={['huge', 'w600']} className={styles.paymentMethod}>₽</P>
        <P styleType={['huge', 'w600']} className={styles.paymentMethod}>$</P>
        <P styleType={['huge', 'w600']} className={styles.paymentMethod}>₿</P>
        <P styleType={['huge', 'w600']} className={styles.paymentMethod}>€</P>
      </div>
    </div >
    }
  </div>
  </div>)
}