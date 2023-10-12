import Image from 'next/image'
import wallet from 'images/wallet_gradient.png'
import styles from './index.module.scss'

interface Props {
}

export default function Benefits(props: Props) {

  return (<div className={styles.root}> 
    <h3 className={styles.title}>Почему стоит выбрать обучение <p>в <span>Arbi</span>Hunter?</p></h3>
    <p className={styles.item}>
      <Image src={wallet} alt={'benefit'} width={76} height={76}/>
       Обучение на основе государственной лицензии
    </p>
    <p className={styles.item}>
      <Image src={wallet} alt={'benefit'} width={76} height={76}/>
       Обучение на основе государственной лицензии
    </p>
    <p className={styles.item}>
      <Image src={wallet} alt={'benefit'} width={76} height={76}/>
       Обучение на основе государственной лицензии
    </p>
    {/* <p className={styles.item}>
      <Image src={wallet} alt={'benefit'} width={76} height={76}/>
       Обучение на основе государственной лицензии
    </p> */}

  </div>)
}