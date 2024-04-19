import CVs from '@/components/for_pages/profile/userProfile/CVs'
import ContentLayout from '@/components/layout/ContentLayout'
import { TariffWrapper } from 'context/tariff_state'
import { useRouter } from 'next/router'

interface Props {
}

export default function MyCvsPage(props: Props) {
  const router = useRouter()

  return (<ContentLayout disabledNavBar hideMobileHeader title={'Мои резюме'}>
    <TariffWrapper>
      <CVs/>
    </TariffWrapper>
  </ContentLayout>)
}