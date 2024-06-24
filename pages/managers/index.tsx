import Managers from '@/components/for_pages/profile/companyProfile/Managers'
import ContentLayout from '@/components/layout/ContentLayout'
import { ManagerWrapper } from 'context/manager_state'

interface Props {
}

export default function ManagersPage(props: Props) {

  return (
    <ContentLayout hideMobileHeader>
      <ManagerWrapper>
      <Managers/>
      </ManagerWrapper>
    </ContentLayout>
  )
}