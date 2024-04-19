import Vacancies from '@/components/for_pages/profile/companyProfile/Vacancies'
import ContentLayout from '@/components/layout/ContentLayout'
import { TariffWrapper } from 'context/tariff_state'
import { VacancyWrapper } from 'context/vacancy_state'
// import styles from './index.module.scss'

interface Props {
}

export default function VacanciesPage(props: Props) {

  return (<ContentLayout hideMobileHeader title='Мои вакансии'>
    <VacancyWrapper>
    <TariffWrapper>
      <Vacancies/>
    </TariffWrapper>
    </VacancyWrapper>
  </ContentLayout>)
}