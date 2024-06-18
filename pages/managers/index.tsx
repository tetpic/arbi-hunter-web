import Managers from '@/components/for_pages/profile/companyProfile/Managers'
import ContentLayout from '@/components/layout/ContentLayout'

interface Props {
}

export default function ManagersPage(props: Props) {

  return (
    <ContentLayout hideMobileHeader>
      <Managers/>
    </ContentLayout>
  )
}