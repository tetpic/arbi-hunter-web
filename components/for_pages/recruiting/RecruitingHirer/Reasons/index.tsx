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
          Вакансию увидит каждый второй соискатель
        </p>
        <p className={styles.desc}>
          46% трудоспособного населения России — зарегистрированы на ArbiHunter
        </p>
      </div>
      <div className={styles.item}>
        <div className={styles.image}>
          <Image src={walletWhite} alt={'wallet'}/>
        </div>
        <p className={styles.title}>
          Вакансию увидит каждый второй соискатель
        </p>
        <p className={styles.desc}>
          46% трудоспособного населения России — зарегистрированы на ArbiHunter
        </p>
      </div>
      <div className={styles.item}>
        <div className={styles.image}>
          <Image src={walletWhite} alt={'wallet'}/>
        </div>
        <p className={styles.title}>
          Вакансию увидит каждый второй соискатель
        </p>
        <p className={styles.desc}>
          46% трудоспособного населения России — зарегистрированы на ArbiHunter
        </p>
      </div>
    </div>

  </div>)
}