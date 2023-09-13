import { useCreateVcCvContext } from 'context/createVcCv_state'
import { useAppContext } from 'context/state'
import Image from 'next/image'
import { ModalType } from 'types/enums'
import styles from './index.module.scss'


interface Props {
}

export default function Specialization(props: Props) {

  const appContext = useAppContext()
  const cvContext = useCreateVcCvContext()


  const openModalHandler = () => {
    appContext.showModal(ModalType.SpecializationModal)
  }

  return ( 
    <div className={styles.root}>
      <p className={styles.title}>Выберите специализацию <Image src={'/icons/book.png'} alt={'напишите'} width={24} height={24}/></p>

      <div className={styles.positionWrapper}>
        {cvContext.helpObjects?.categoryIds && cvContext.helpObjects?.categoryIds?.length > 0 && 
          <p className={styles.position}>{cvContext.helpObjects.categoryIds[0].name}</p>
        }
        <p 
        className={styles.link} 
        onClick={openModalHandler}>
          {cvContext.helpObjects?.categoryIds?.length > 0? 'Изменить специализацию': 'Выбрать специализацию'}
        </p>
      </div>
    </div>
  )
}