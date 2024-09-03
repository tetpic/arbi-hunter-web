import ModalLayout from 'components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from 'components/layout/Modal/ModalBody'
import { useAppContext } from 'context/state'
import CrossSvg from '@/components/svg/CrossSvg'
import Button from '@/components/ui/Button'
import { AppTheme } from 'types/enums'
import { colors } from 'styles/variables'

interface Props {
  onClose: () => void
}

export interface ImageViewerModalProps {
  src: string
}

export default function ImageViewerModal(props: Props) {
  const appContext = useAppContext()
  const theme = appContext.theme
  const args = appContext.modalArguments as ImageViewerModalProps

  return (<ModalLayout className={styles.layout} >
    <ModalBody className={styles.body}>
      <Button styleType={['icon', 'backTransparent']} onClick={props.onClose}><CrossSvg color={theme === AppTheme.Light && colors.black}/></Button>
      <img onClick={props.onClose} src={args.src} alt={'image viewer'}/>
    </ModalBody>
  </ModalLayout>)
}