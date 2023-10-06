import Image from 'next/image'
import cryptoImage from 'images/crypto_wallet.png'
import Button from 'components/ui/Button'
import styles from './index.module.scss'

interface Props {
}

export default function MediaCrypto(props: Props) {

  return (<div className={styles.root}> 
    <div className={styles.content}>
      <p className={styles.title}>Крипто-сфера</p>
      <p className={styles.subTitle}>подборка новостей из мира криптовалюты</p>
      <Button className={styles.button} title='подборка новостей из мира криптовалюты'>Открыть 123 статьи</Button>
    </div>
    <div className={styles.imageWrapper}>
      <Image className={styles.image} src={cryptoImage} alt={'crypto wallet'} width={542} height={226}/>
    </div>
  </div>)
}