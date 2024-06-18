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
import P from '@/components/ui/P'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

interface Props {
  onClose: ()=>void
}

export interface ICongratulationsModalProps {
  course: ICourse
}

export default function CongratulationsModal(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const args = appContext.modalArguments as ICongratulationsModalProps
  const router = useRouter()

  const openFeedbacks = () => {
    appContext.showModal<ICourseFeedbackModalProps>(ModalType.CourseFeedbackModal, {courseId: args.course.id})
  }

  const onBack = () => {
    router.back()
    setTimeout(() => {
      props.onClose()
    }, 50)
  }


  const body = (
    <div className={styles.root}>
      <Button className={styles.closeModal} onClick={onBack}><CrossSvg/></Button>
      <Image src={prise} alt={'prise'} width={222} height={222}/>
      <P styleType={['w600', 'huge', 'textCenter']} useThemeColor className={styles.title}>{t('courses_congratulations1')} <br/> {t('courses_congratulations2')}</P>
      {args.course.certificate &&
        <P styleType={['small']} useThemeColor >{t('courses_downloadCertificateInfo')}</P>
      }
      
      <div className={styles.buttonsWrapper}>
        {args.course.certificate &&
          <Link 
          target='_blank'  
          download 
          rel="noopener noreferrer" 
          href={ImageHelper.urlFromSource(args.course.certificate?.source)} 
          className={styles.buttonGradient}>
            {t('courses_downloadCertificate')}
          </Link>
        }
        <Button className={styles.buttonBorderGradient} onClick={openFeedbacks} >{t('courses_leaveFeedback')}</Button>
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