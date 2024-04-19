import styles from './index.module.scss'

import { useCreateVcCvContext } from 'context/createVcCv_state'
import { useAppContext } from 'context/state'
import Image from 'next/image'
import { ModalType } from 'types/enums'
import { ISpecializationModalProps } from 'components/modals/CvModals/Specialization'
import { ISpecializationCategory } from 'data/interfaces/Common'
import useTranslation from 'next-translate/useTranslation'


interface Props {
}

export default function Specialization(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const cvContext = useCreateVcCvContext()

  const onModalSubmit = (data: ISpecializationCategory[]) => {
    cvContext.setActiveSubcategory(data)
    cvContext.setActiveCategory(null)

    const helperCv = cvContext.helpObjects
    cvContext.setHelpObjects({...helperCv, categoryIds: data})
  }

  const openModalHandler = () => {
    appContext.showModal<ISpecializationModalProps>(ModalType.SpecializationModal, {
      onSubmit: (data) => onModalSubmit(data), 
      manyItems: false
    })
  }

  return ( 
    <div className={styles.root}>
      <p className={styles.title}>{t('create_setSpecializationAlt')} <Image src={'/icons/book.png'} alt={'write'} width={24} height={24}/></p>

      <div className={styles.positionWrapper}>
        {cvContext.activeSubCategory.length > 0 && 
          <p className={styles.position}>{cvContext.activeSubCategory[0].name}</p>
        }
        <p 
        className={styles.link} 
        onClick={openModalHandler}>
          {cvContext.helpObjects?.categoryIds?.length > 0? t('create_changeSpecialization'): t('create_setSpecializationInfinitive')}
        </p>
      </div>
    </div>
  )
}