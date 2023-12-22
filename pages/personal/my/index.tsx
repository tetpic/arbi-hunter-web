import PersonalPage from 'components/for_pages/personal'
import ContentLayout from 'components/layout/ContentLayout'
import { PersonalWrapper } from 'context/personal_state'

interface Props {
}

export default function MyCompanyPage() {

  return (
    <ContentLayout hideMobileHeader>
      <PersonalWrapper>
        <PersonalPage/>
      </PersonalWrapper>
    </ContentLayout>
  )
}