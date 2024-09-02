import CVs from '@/components/for_pages/profile/userProfile/CVs'
import ContentLayout from '@/components/layout/ContentLayout'
import { TariffWrapper } from 'context/tariff_state'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

interface Props {
}

export default function MyCvsPage(props: Props) {
  const router = useRouter()
  const {t} = useTranslation()

  return (<ContentLayout hideMobileHeader title={t('nav_myCvs')}>
    <TariffWrapper>
      <CVs/>
    </TariffWrapper>
  </ContentLayout>)
}