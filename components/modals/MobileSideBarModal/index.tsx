import styles from './index.module.scss'

import MobileSideBar from 'components/layout/MobileSideBar'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'

interface Props {
  onClose: ()=> void
}

export default function MobileSideBarModal(props: Props) {

  return (<ModalLayout className={styles.modalLayout}>
    <ModalBody className={styles.modalBody}>
      <MobileSideBar onClose={props.onClose}/>
    </ModalBody>
  </ModalLayout>)
}