import P from '@/components/ui/P'
import styles from './index.module.scss'
import Title from '@/components/ui/TitleForSection'
import { useRouter } from 'next/router'
import Link from 'next/link'
import TelegramSvg from '@/components/svg/TelegramSvg'
import useTranslation from 'next-translate/useTranslation'

interface Props {
}


export default function SiteMap(props: Props) {
  const router = useRouter()
  const {t} = useTranslation()

  return (<div className={styles.root}> 
    <Title title={t('footer_siteMap')} onBackClick={router.back} className={styles.title}/>
    <div className={styles.divider}></div>
    <P styleType={['large', 'w600']} useThemeColor>{t('sitemap_mainpade')} </P>
    <Link href={'/about'}><P styleType={['medium']} useThemeColor className={styles.link}>{t('sitemap_about')}</P></Link>
    <Link href={'/rules'}><P styleType={['medium']} useThemeColor className={styles.link}>{t('sitemap_rules')}</P></Link>
    <Link href={'/privacy'}><P styleType={['medium']} useThemeColor className={styles.link}>{t('sitemap_privacy')}</P></Link>
    <div className={styles.divider}></div>
    <P styleType={['large', 'w600']} useThemeColor>{t('sitemap_forHirers')}</P>
    <Link href={'/create/vacancy'}><P styleType={['medium']} useThemeColor className={styles.link}>{t('sitemap_createCV')}</P></Link>
    <Link href={'/recruiting'}><P styleType={['medium']} useThemeColor className={styles.link}>{t('sitemap_catalogCVs')}</P></Link>
    <div className={styles.divider}></div>
    <P styleType={['large', 'w600']} useThemeColor>{t('sitemap_forEmployees')}</P>
    <Link href={'/create/cv'}><P styleType={['medium']} useThemeColor className={styles.link}>{t('sitemap_createVacancy')}</P></Link>
    <Link href={'/recruiting'}><P styleType={['medium']} useThemeColor className={styles.link}>{t('sitemap_catalogVacancies')}</P></Link>
    <div className={styles.divider}></div>
    <P styleType={['large', 'w600', 'alignCenter']} useThemeColor>{t('sitemap_support')}</P>
    <Link href={'https://t.me/arbihunter_support'}>
      <P styleType={['medium', 'alignCenter']} useThemeColor className={styles.link}> <TelegramSvg/>  {t('sitemap_supportManager')}</P>
    </Link>
    <div className={styles.divider}></div>
    <P styleType={['large', 'w600']} useThemeColor>{t('sitemap_forPartners')}</P>
    <Link href={'https://t.me/samesonggg'}><P useThemeColor className={styles.link}  styleType={['medium', 'alignCenter']}><TelegramSvg/> {t('sitemap_partnerQuestions')}</P></Link>


  </div>)
}