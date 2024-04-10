import { useAppContext } from 'context/state'
import styles from './index.module.scss'
import P from '@/components/ui/P'
import Button from '@/components/ui/Button'
import ModalLayout from '@/components/layout/Modal/ModalLayout'
import ModalBody from '@/components/layout/Modal/ModalBody'

interface Props {
  onClose: () => void
}

export interface AlertModalArgs {
  text: string|JSX.Element|JSX.Element[],
  onClick?: () => void
}

export default function AlertModal(props: Props) {
  const args: AlertModalArgs = useAppContext().modalArguments

  const body = (
    <div className={styles.root}> 
    <P styleType={['medium', 'w500', 'textCenter']}>{args.text}</P>
    <Button styleType={['gradient', 'wide']} onClick={args.onClick} className={styles.okButton}>Ok</Button>
  </div>
  )


  return (
    <ModalLayout className={styles.modalLayout}>
      <ModalBody>
        {body}
      </ModalBody>
    </ModalLayout>
  )
}