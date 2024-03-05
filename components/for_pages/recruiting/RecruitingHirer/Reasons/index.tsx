import styles from './index.module.scss'

import Image from 'next/image'
import bucket from 'images/recruiting/bucket.png'
import walletWhite from 'images/recruiting/walletWhite.png'
import { useRef } from 'react'
import { useTriggerOnVisible } from 'components/hooks/useTriggerOnVisible'


interface Props {
}

export default function Reasons(props: Props) {
  const triggerRef = useRef<HTMLDivElement>(null!)
  useTriggerOnVisible(triggerRef, ()=> {
    document.querySelectorAll(`.${styles.bucket}`).forEach(el=> el.classList.add(`${styles.bucket_active}`))
  },
  {offset: 100}
  )  

  return (<div className={styles.root} ref={triggerRef}> 
    <div className={styles.left}>
      <p className={styles.title}>
        Почему стоит <br/>
        разместить вакансию <br/>
        в <span className={styles.title_purple}>Arbi</span>Hunter?
      </p>
      <Image src={bucket} className={styles.bucket}  width={200} height={200} alt={'bucket'}/>
    </div>
    <div className={styles.right}>
      <div className={styles.item}>
        <div className={styles.image}>
          <Image src={walletWhite} alt={'wallet'}/>
        </div>
        <p className={styles.title}>
          Единая база соискателей
        </p>
        <p className={styles.desc}>
          Больше не нужно искать по разным площадкам, все кандидаты из сферы ждут вашего предложения после регистрации
        </p>
      </div>
      <div className={styles.item}>
        <div className={styles.image}>
          <Image src={walletWhite} alt={'wallet'}/>
        </div>
        <p className={styles.title}>
          Удобная система поиска
        </p>
        <p className={styles.desc}>
          Еще никогда поиск сотрудников не был так удобен, благодаря встроенным расширенным фильтрам с нужным набором навыков
        </p>
      </div>
      <div className={styles.item}>
        <div className={styles.image}>
          <Image src={walletWhite} alt={'wallet'}/>
        </div>
        <p className={styles.title}>
          Поиск с любого устройства
        </p>
        <p className={styles.desc}>
          Наш сайт и мобильное приложение позволят вам заниматься поиском сотрудников с любого устройства
        </p>
      </div>
    </div>

  </div>)
}