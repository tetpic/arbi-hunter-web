import { useAppContext } from 'context/state'
import styles from './index.module.scss'
import ModalLayout from '@/components/layout/Modal/ModalLayout'
import ModalBody from '@/components/layout/Modal/ModalBody'

interface Props {
}

export interface RemoveMessageConfirmModalArgs {

}



export default function RemoveMessageConfirmModal(props: Props) {
  const appContext = useAppContext()
  const args:RemoveMessageConfirmModalArgs = appContext.modalArguments


  const body = (
    <div className={styles.root}>
      
    </div>
  )
  

  return (<ModalLayout>
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>)
}