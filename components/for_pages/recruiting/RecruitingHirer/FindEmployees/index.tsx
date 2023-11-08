import styles from './index.module.scss'

import Image from 'next/image'
import register from 'images/recruiting/register.png'
import land_vacancy from 'images/recruiting/land_vacancy.png'
import star from 'images/recruiting/star.png'
import chain from 'images/recruiting/chain.svg'

interface Props {
}

export default function FindEmployees(props: Props) {

  return (<div className={styles.root}> 
    <div className={styles.item}>
      <Image src={register} alt={'register'}/>
      <p className={styles.step}>Шаг 1</p>
      <p className={styles.title}>Зарегистрируйтесь</p>
      <p className={styles.desc}>И получите доступ ко всем услугам</p>
    </div>
    <Image src={chain} alt={'chain'}/>
    <div className={styles.item}>
      <Image src={land_vacancy} alt={'land vacancy'}/>
      <p className={styles.step}>Шаг 2</p>
      <p className={styles.title}>Разместите вакансию</p>
      <p className={styles.desc}>И получите доступ ко всем услугам</p>
    </div>
    <Image src={chain} alt={'chain'}/>
    <div className={styles.item}>
      <Image src={star} alt={'star'}/>
      <p className={styles.step}>Шаг 3</p>
      <p className={styles.title}>Выбирайте лучших</p>
      <p className={styles.desc}>И получите доступ ко всем услугам</p>
    </div>
  </div>)
}