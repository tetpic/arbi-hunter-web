import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import Button from 'components/ui/Button'
import { useAppContext } from 'context/state'
import styles from './index.module.scss'

interface Props {
  onClose: ()=>void
}

export interface IConfirmModalProps {
  text: string, 
  callback: Function
}

export default function ConfirmModal(props: Props) {

  const appContext = useAppContext()
  const modalArguments = appContext.modalArguments as {text: string, callback: Function} 

  const onTrueClickHandler = () => {
    modalArguments.callback()
    appContext.hideModal()
  }

  const body = (
    <>
      <p className={styles.text}>{modalArguments.text}</p>
      <div className={styles.buttonsWrapper}>
        <Button className={styles.button} onClick={onTrueClickHandler}>Да</Button>
        <Button className={styles.button} onClick={props.onClose}>Нет</Button>
      </div>
    </>
  )

  return (
    <ModalLayout className={styles.modalLayout}>
      <ModalBody className={styles.modalBody}>
        {body}
      </ModalBody>
    </ModalLayout>
  )
}