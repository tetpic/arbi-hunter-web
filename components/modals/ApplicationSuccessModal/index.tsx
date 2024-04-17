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
  const args = appContext.modalArguments as IApplicationSuccessModalProps


  const body = (
    <div className={styles.root}>
      <Button className={styles.closeButton} onClick={props.onClose}><CrossSvg/></Button>
      <Image src={folderImage} alt={'folder'} width={152} height={152}/>
      <p className={styles.title}>{args?.type === 'cv'?'Ваше резюме успешно отправлено':'Приглашение отправлено'}</p>
      <p className={styles.description}>Вы можете отслеживать статус вашей заявки в личном кабинете</p>
      <Link onClick={props.onClose} className={styles.grayLink} href={args.type === 'cv'?'/profile?page=feedbacks':`/responses/${args.id}`}>Перейти в раздел откликов</Link>
      <Link 
      onClick={props.onClose} 
      className={styles.blueLink} 
      href={{pathname: '/recruiting', query: {filters: JSON.stringify({categories: [args.type === 'vc'?args.cv.categories[0]?.baseId:args.vacancy.categories[0]?.baseId]})}}}>
        Смотреть похожие {args.type === 'cv'?'вакансии':'резюме'}
      </Link>
    </div>
  )

  return (<ModalLayout className={styles.modalLayout} mobileFullScreen>
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>)
}