import ModalLayout from 'components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from 'components/layout/Modal/ModalBody'
import folderImage from 'images/respond_folder.png'
import Image from 'next/image'
import Link from 'next/link'
import CrossSvg from 'components/svg/CrossSvg'
import Button from 'components/ui/Button'

interface Props {
  onClose: ()=> void
}

export default function ApplicationSuccessModal(props: Props) {

  const body = (
    <div className={styles.root}>
      <Button className={styles.closeButton} onClick={props.onClose}><CrossSvg/></Button>
      <Image src={folderImage} alt={'folder'} width={152} height={152}/>
      <p className={styles.title}>Ваше резюме успешно отправлено</p>
      <p className={styles.description}>Вы можете отслеживать статус вашей заявки в личном кабинете</p>
      <Link className={styles.grayLink} href={'/profile?page=feedbacks'}>Перейти в раздел откликов</Link>
      <Link className={styles.blueLink} href={'/'}>Смотреть похожие вакансии</Link>
    </div>
  )

  return (<ModalLayout className={styles.modalLayout}>
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>)
}