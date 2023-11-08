import styles from './index.module.scss'
import Image from 'next/image'
import faq from 'images/recruiting/recruiting_faq.png'
import telegram from 'images/recruiting/recruiting_telegram.png'
import Button from 'components/ui/Button'

interface Props {
}

export default function Help(props: Props) {

  return (
    <section className={styles.root}>
      <p className={styles.title}>Нужна помощь? Оставьте заявку <br/> и мы с вами свяжемся!</p>
      <p className={styles.desc}>Представляем новую функцию в&nbsp;мобильном приложении ArbiHunter Поиск сотрудников стал еще более удобный!</p>
      <Button className={styles.button}>
        <Image src={telegram} alt={'telegram icon'}/>
        Написать в поддержку в Telegramm
      </Button>
      <Image className={styles.image} src={faq} alt={'faq image'}/>
    </section>
  )
}