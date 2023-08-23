import InputField from 'components/fields/InputField'
import { useAppContext } from 'context/state'
import Image from 'next/image'
import { ModalType } from 'types/enums'
import styles from './index.module.scss'


interface Props {
}

export default function Specialization(props: Props) {

  const appContext = useAppContext()


  const openModalHandler = () => {
    appContext.showModal(ModalType.SpecializationModal)
  }

  return ( 
    <div className={styles.root}>
      <p className={styles.title}>Выберите специализацию <Image src={'/icons/book.png'} alt={'напишите'} width={24} height={24}/></p>
      <InputField className={styles.inputHidden} name={'position'} type={'hidden'} styleType={'default'} color={'default'}/>
      <p className={styles.link} onClick={openModalHandler}>Выбрать специализацию</p>
    </div>
  )
}