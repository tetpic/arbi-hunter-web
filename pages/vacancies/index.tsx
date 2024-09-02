import Vacancies from '@/components/for_pages/profile/companyProfile/Vacancies'
import ContentLayout from '@/components/layout/ContentLayout'
import { TariffWrapper } from 'context/tariff_state'
import { VacancyWrapper } from 'context/vacancy_state'
import useTranslation from 'next-translate/useTranslation'
// import styles from './index.module.scss'

interface Props {
}

export default function VacanciesPage(props: Props) {
  const {t} = useTranslation()

  return (<ContentLayout hideMobileHeader title={t('nav_myVacancies')}>
    <VacancyWrapper>
    <TariffWrapper>
      <Vacancies/>
    </TariffWrapper>
    </VacancyWrapper>
  </ContentLayout>)
}