import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import Button from 'components/ui/Button'
import Image from 'next/image'
import prise from '/images/superprice.webp'
import styles from './index.module.scss'

interface Props {
  onClose: ()=>void
}

export default function CongratulationsModal(props: Props) {

  const body = (
    <div className={styles.root}>
      <Image src={prise} alt={'prise'} width={222} height={222}/>
      <p className={styles.title}>Поздравляем вас, вы прошли курс!</p>
      <p className={styles.info}>Скачайте сертификат о прохождении курса</p>
      
      <div className={styles.buttonsWrapper}>
        <Button className={styles.buttonYellow}>Скачать сертификат</Button>
        <Button className={styles.buttonBlack} onClick={props.onClose}>Назад</Button>
      </div>
    </div>
  )



  return (
    <ModalLayout mobileFullScreen className={styles.modalLayout}>
      <ModalBody className={styles.modalBody}>
        {body}
      </ModalBody>
    </ModalLayout>
  )
}