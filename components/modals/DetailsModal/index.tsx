import styles from './index.module.scss'

import ModalLayout from 'components/layout/Modal/ModalLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import DetailsField, { DetailsFieldProps } from 'components/for_pages/create/utils/DetailsField'
import { useAppContext } from 'context/state'


interface Props {
  onClose: ()=> void
}

export default function DetailsModal(props: Props) {

  const appContext = useAppContext()
  const args = appContext.modalArguments as DetailsFieldProps<any>

  return (
    <ModalLayout mobileFullScreen  className={styles.modalLayout}>
      <ModalBody>
        <DetailsField {...args}/>
      </ModalBody>
    </ModalLayout>
  )
}