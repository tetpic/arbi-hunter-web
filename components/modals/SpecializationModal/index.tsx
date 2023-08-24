import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import { useCvContext } from 'context/cv_state'
import styles from './index.module.scss'

interface Props {
}

export default function SpecializationModal(props: Props) {

  const cvContext = useCvContext()

  

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