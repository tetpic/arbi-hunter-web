import ContentLayout from '@/components/layout/ContentLayout'
import Development from '@/components/ui/Development'

interface Props {
}

export default function NotificationsPage(props: Props) {

  return (<ContentLayout withFooter>
    <Development/>
  </ContentLayout>)
}