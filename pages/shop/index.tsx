import Shop from '@/components/for_pages/shop'
import ContentLayout from '@/components/layout/ContentLayout'
import { TariffWrapper } from 'context/tariff_state'

interface Props {
}

export default function ShopPage(props: Props) {

  return (
    <ContentLayout>
      <TariffWrapper>
        <Shop/>
      </TariffWrapper>
    </ContentLayout>
  )
}