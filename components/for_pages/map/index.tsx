import P from '@/components/ui/P'
import styles from './index.module.scss'
import Title from '@/components/ui/TitleForSection'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface Props {
}

// Главная станица 
// О компании
// Условия оказания услуг
// Политика конфиденциальности
// Работадателям
// Создать вакансию
// Каталог резюме
// Соискателям
// Создать резюме
// Каталог вакансий
// Техническая поддержка
// -
// Партнерам 

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
    <P styleType={['large', 'w600']}>Техническая поддержка</P>
    <div className={styles.divider}></div>
    <P styleType={['large', 'w600']}>Партнерам</P>

  </div>)
}