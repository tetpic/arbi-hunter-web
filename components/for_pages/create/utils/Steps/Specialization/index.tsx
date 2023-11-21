import { useCreateVcCvContext } from 'context/createVcCv_state'
import { useAppContext } from 'context/state'
import Image from 'next/image'
import { ModalType } from 'types/enums'
import styles from './index.module.scss'
import { ISpecializationModalProps } from 'components/modals/CvModals/Specialization'
import { ISpecializationCategory } from 'data/interfaces/Common'


interface Props {
}

export default function Specialization(props: Props) {
  const appContext = useAppContext()
  const cvContext = useCreateVcCvContext()

  const onModalSubmit = (data: ISpecializationCategory | ISpecializationCategory[]) => {
    const helperCv = cvContext.helpObjects
    cvContext.setHelpObjects({...helperCv, categoryIds: [!Array.isArray(data)&&data]})
  }

  const openModalHandler = () => {
    appContext.showModal<ISpecializationModalProps>(ModalType.SpecializationModal, {onSubmit: onModalSubmit, manyItems: false})
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