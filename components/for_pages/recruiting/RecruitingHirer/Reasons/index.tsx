import styles from './index.module.scss'

import Image from 'next/image'
import bucket from 'images/recruiting/bucket.png'
import walletWhite from 'images/recruiting/walletWhite.png'

interface Props {
}

export default function Reasons(props: Props) {

  return (<div className={styles.root}> 
    <div className={styles.left}>
      <p className={styles.title}>
        Почему стоит <br/>
        разместить вакансию <br/>
        в <span className={styles.title_purple}>Arbi</span>Hunter?
      </p>
      <Image src={bucket} alt={'bucket'}/>
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