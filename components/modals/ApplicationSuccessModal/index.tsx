import ModalLayout from 'components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from 'components/layout/Modal/ModalBody'
import folderImage from 'images/respond_folder.png'
import Image from 'next/image'
import Link from 'next/link'
import CrossSvg from 'components/svg/CrossSvg'
import Button from 'components/ui/Button'
import { useAppContext } from 'context/state'
import { ICV } from 'data/interfaces/ICV'
import { IVacancy } from 'data/interfaces/IVacancy'
import useTranslation from 'next-translate/useTranslation'
import P from '@/components/ui/P'
import { useRouter } from 'next/router'

interface Props {
  onClose: ()=> void
}

export interface IApplicationSuccessModalProps {
  type: 'cv'|'vc'
  id?: number
  cv?: ICV,
  vacancy?: IVacancy
}

export default function ApplicationSuccessModal(props: Props) {
  const appContext = useAppContext()
  const theme = appContext.theme
  const router = useRouter()
  const args = appContext.modalArguments as IApplicationSuccessModalProps
  const {t} = useTranslation()


  const body = (
    <div className={styles.root}>
      <Button className={styles.closeButton} altStyleType={['invertSvg']} onClick={props.onClose}><CrossSvg/></Button>
      <Image src={folderImage} alt={'folder'} width={152} height={152}/>
      <P useThemeColor styleType={['textCenter', 'huge', 'w600']} >{args?.type === 'cv'?t('application_cvSend'):t('application_send')}</P>
      <p className={styles.description}>{t('application_sendInfo')}</p>
      <Button 
      styleType={['grey']} 
      altStyleType={['whitePurple']} 
      onClick={()=> {

        router.push(args.type === 'cv'?'/profile?page=feedbacks':'/responses/'+args.id)
        props.onClose()
      }} 
      >
        {t('application_goToFeedbacks')}
      </Button>
      <Link 
      onClick={props.onClose} 
      className={styles.blueLink} 
      href={{pathname: '/recruiting', query: {filters: JSON.stringify({categories: [args.type === 'vc'?args.cv?.categories?.[0]?.baseId:args.vacancy?.categories?.[0]?.baseId]})}}}>
        {args.type==='cv'?t('application_watchRelevantCvs'):t('application_watchRelevantVacancies')}
      </Link>
    </div>
  )

  return (<ModalLayout className={styles.modalLayout} mobileFullScreen>
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>)
}