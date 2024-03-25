import Shop from '@/components/for_pages/shop'
import ContentLayout from '@/components/layout/ContentLayout'
import { CvWrapper } from 'context/cv_state'
import { TariffWrapper } from 'context/tariff_state'
import { VacancyWrapper } from 'context/vacancy_state'

interface Props {
}

export default function ShopPage(props: Props) {

  return (
    <ContentLayout>
      <TariffWrapper>
      <VacancyWrapper>
      <CvWrapper>
        <Shop/>
      </CvWrapper>  
      </VacancyWrapper>
      </TariffWrapper>
    </ContentLayout>
  )
}