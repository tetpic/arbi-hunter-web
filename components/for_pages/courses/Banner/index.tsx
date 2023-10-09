import Button from 'components/ui/Button'
import styles from './index.module.scss'
import girl from 'images/girl.png'
import Image from 'next/image'

interface Props {
}

export default function Banner(props: Props) {

  return (
  <div className={styles.root}> 
    <div className={styles.content}>
      <p className={styles.title}>IT -профессия</p>
      <p className={styles.subTitle}>Смените профессию, получите новые навыки, запустите карьеру</p>
      <div className={styles.tags}>
        <p className={styles.tag}>Разработка</p>
        <p className={styles.tag}>Дизайн</p>
        <p className={styles.tag}>Разработка</p>
        <p className={styles.tag}>Дизайн</p>
        <p className={styles.tag}>Разработка</p>
      </div>
      <Button className={styles.button}>Выбрать из 163 курсов</Button>
    </div>
    <div className={styles.imageWrapper}>
      <Image 
      src={girl} 
      alt={'girl'} 
      width={336} 
      height={336} 
      />
    </div>
  </div>)
}