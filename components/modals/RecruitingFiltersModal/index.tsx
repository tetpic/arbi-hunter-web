import ModalLayout from 'components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from 'components/layout/Modal/ModalBody'
import FilterHirer from '@/components/for_pages/recruiting/Filters/FilterHirer'
import { useAppContext } from 'context/state'
import TitleForSection from 'components/ui/TitleForSection'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import FilterEmployee from '@/components/for_pages/recruiting/Filters/FilterEmployee'
import { IVacancyCvSearchParams } from 'data/interfaces/Common'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  onClose?: () => void
}

export interface IRecruitingFiltersModalProps {
  onFilterChange: (data: Partial<IVacancyCvSearchParams>) => void
}

export default function RecruitingFiltersModal(props: Props) {
  const appContext = useAppContext()
  const userContext = useUserContext()
  const {t} = useTranslation()
  const args = appContext.modalArguments as IRecruitingFiltersModalProps

  return (<ModalLayout mobileFullScreen>
    <ModalBody className={styles.modalBody}>
      <TitleForSection title={t('filters')} onBackClick={props.onClose}/>
      {userContext.currentProfile?.profileType === ProfileType.Hirer &&
      <FilterHirer onFilterChange={args.onFilterChange}/>
      ||
      userContext.currentProfile?.profileType === ProfileType.Employee &&
      <FilterEmployee onFilterChange={args.onFilterChange}/>
      }
    </ModalBody>
  </ModalLayout>)
}