import P from '@/components/ui/P'
import styles from './index.module.scss'
import Title from '@/components/ui/TitleForSection'
import { useRouter } from 'next/router'
import Link from 'next/link'
import TelegramSvg from '@/components/svg/TelegramSvg'

interface Props {
}


export default function SiteMap(props: Props) {
  const router = useRouter()

  return (<div className={styles.root}> 
    <Title title={'Карта сайта'} onBackClick={router.back} className={styles.title}/>
    <div className={styles.divider}></div>
    <P styleType={['large', 'w600']}>Главная станица </P>
    <Link href={'/about'}><P styleType={['medium']} className={styles.link}>О компании</P></Link>
    <Link href={'/rules'}><P styleType={['medium']} className={styles.link}>Условия оказания услуг</P></Link>
    <Link href={'/privacy'}><P styleType={['medium']} className={styles.link}>Политика конфиденциальности</P></Link>
    <div className={styles.divider}></div>
    <P styleType={['large', 'w600']}>Работадателям</P>
    <Link href={'/create/vacancy'}><P styleType={['medium']} className={styles.link}>Создать вакансию</P></Link>
    <Link href={'/recruiting'}><P styleType={['medium']} className={styles.link}>Каталог резюме</P></Link>
    <div className={styles.divider}></div>
    <P styleType={['large', 'w600']}>Соискателям</P>
    <Link href={'/create/cv'}><P styleType={['medium']} className={styles.link}>Создать резюме</P></Link>
    <Link href={'/recruiting'}><P styleType={['medium']} className={styles.link}>Каталог вакансий</P></Link>
    <div className={styles.divider}></div>
    <Link href={'https://t.me/arbihunter_support'}>
    <P styleType={['large', 'w600', 'alignCenter']}><TelegramSvg/> Техническая поддержка</P>
    </Link>
    <div className={styles.divider}></div>
    <P styleType={['large', 'w600']}>Партнерам</P>
    <Link href={'https://t.me/samesonggg'}><P className={styles.link}  styleType={['medium', 'alignCenter']}><TelegramSvg/> По вопросам сотрудничества</P></Link>


  </div>)
}