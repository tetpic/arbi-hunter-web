import Image from 'next/image'
import rightImage from 'images/media_right.png'
import leftImage from 'images/media-left.png'
import Button from 'components/ui/Button'
import styles from './index.module.scss'



interface Props {
}

export default function MediaPageHeader(props: Props) {

  return (  <div className={styles.header}>
    <Image className={styles.headerImageLeft} src={leftImage} alt={'left item image'} width={225} height={292}/>
    <Image className={styles.headerImageRight} src={rightImage} alt={'left item image'} width={283} height={292}/>
    <div className={styles.content}>
      <h1 className={styles.title}>Присоединяйся к комьюнити <br /> <span>Arbi</span>Hunter</h1>
      <p className={styles.text}>Зарегистрируйся и получи доступ к подпискам на сообщества, сохраняйте статьи, подписывайтесь на новости</p>
    </div>
    <Button className={styles.registerButton}><span>Зарегистрироваться</span></Button>
  </div>)
}