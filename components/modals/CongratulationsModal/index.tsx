import styles from './index.module.scss'

import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import Button from 'components/ui/Button'
import Image from 'next/image'
import prise from '/images/superprice.webp'
import { useAppContext } from 'context/state'
import ICourse from 'data/interfaces/ICourse'
import Link from 'next/link'
import CrossSvg from 'components/svg/CrossSvg'
import { ModalType } from 'types/enums'
import { ICourseFeedbackModalProps } from '../CourseFeedbackModal'
import ImageHelper from 'utils/ImageHelper'

interface Props {
  onClose: ()=>void
}

export interface ICongratulationsModalProps {
  course: ICourse
}

export default function CongratulationsModal(props: Props) {

  const appContext = useAppContext()
  const args = appContext.modalArguments as ICongratulationsModalProps

  const openFeedbacks = () => {
    appContext.showModal<ICourseFeedbackModalProps>(ModalType.CourseFeedbackModal, {courseId: args.course.id})
  }


  const body = (
    <div className={styles.root}>
      <Button className={styles.closeModal} onClick={props.onClose}><CrossSvg/></Button>
      <Image src={prise} alt={'prise'} width={222} height={222}/>
      <p className={styles.title}>Поздравляем вас, <br/> вы прошли курс!</p>
      <p className={styles.info}>Скачайте сертификат о прохождении курса</p>
      
      <div className={styles.buttonsWrapper}>
        <Link 
        target='_blank'  
        download 
        rel="noopener noreferrer" 
        href={ImageHelper.urlFromSource(args.course.certificate.source)} 
        className={styles.buttonGradient}>Скачать сертификат</Link>
        <Button className={styles.buttonBorderGradient} onClick={openFeedbacks} >Оставить отзыв</Button>
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