import SiteMap from '@/components/for_pages/map'
import ContentLayout from '@/components/layout/ContentLayout'

interface Props {
}

export default function SiteMapPage(props: Props) {

  return (<ContentLayout withFooter hideMobileHeader >
    <SiteMap/>
  </ContentLayout>)
}