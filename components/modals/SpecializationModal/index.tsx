import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import styles from './index.module.scss'

interface Props {
}

export default function SpecializationModal(props: Props) {

  const body = (<>
  модалка выбора специализации
  </>)



  return ( 
    <ModalLayout>
      <ModalBody>
        {body}
      </ModalBody>
    </ModalLayout>

  )
}