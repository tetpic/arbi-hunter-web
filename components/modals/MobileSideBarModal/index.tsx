import styles from './index.module.scss'

import MobileSideBar from 'components/layout/MobileSideBar'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'

interface Props {
  onClose: ()=> void
}

export default function MobileSideBarModal(props: Props) {

  return (<ModalLayout mobileFullScreen className={styles.modalLayout}>
    <ModalBody>
      <MobileSideBar onClose={props.onClose}/>

    </ModalBody>
  </ModalLayout>)
}