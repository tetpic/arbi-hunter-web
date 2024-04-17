import ModalLayout from 'components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from 'components/layout/Modal/ModalBody'
import { useAppContext } from 'context/state'
import CrossSvg from '@/components/svg/CrossSvg'
import Button from '@/components/ui/Button'

interface Props {
  onClose: () => void
}

export interface ImageViewerModalProps {
  src: string
}

export default function ImageViewerModal(props: Props) {
  const appContext = useAppContext()
  const args = appContext.modalArguments as ImageViewerModalProps

  return (<ModalLayout className={styles.layout}>
    <ModalBody>
      <Button styleType={['icon', 'backTransparent']} onClick={props.onClose}><CrossSvg/></Button>
      <img onClick={props.onClose} src={args.src} alt={'image viewer'}/>
    </ModalBody>
  </ModalLayout>)
}