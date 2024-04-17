import PersonalPage from 'components/for_pages/personal'
import ContentLayout from 'components/layout/ContentLayout'
import { PersonalWrapper } from 'context/personal_state'
import { TariffWrapper } from 'context/tariff_state'

interface Props {
}

export default function MyCompanyPage() {

  return (
    <ContentLayout hideMobileHeader withMobileMenu>
      <PersonalWrapper key={'my_personal_page'}>
      <TariffWrapper>
        <PersonalPage/>
      </TariffWrapper>
      </PersonalWrapper>
    </ContentLayout>
  )
}