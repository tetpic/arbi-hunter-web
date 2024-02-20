import ModalLayout from 'components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from 'components/layout/Modal/ModalBody'
import Filters from '@/components/for_pages/recruiting/Filters/FilterHirer'
import { useAppContext } from 'context/state'
import { IVacancyCvSearchParams } from 'data/interfaces/Common'
import TitleForSection from 'components/ui/TitleForSection'

interface Props {
  onClose?: () => void
}

export interface IRecruitingFiltersModalProps {
  onFilterChange: (data: IVacancyCvSearchParams) => void
}

export default function RecruitingFiltersModal(props: Props) {
  const appContext = useAppContext()
  const args = appContext.modalArguments as IRecruitingFiltersModalProps

  return (<ModalLayout mobileFullScreen>
    <ModalBody className={styles.modalBody}>
      <TitleForSection title={'Фильтры'} onBackClick={props.onClose}/>
      <Filters onFilterChange={args.onFilterChange}/>
    </ModalBody>
  </ModalLayout>)
}