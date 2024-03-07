import ContentLayout from '@/components/layout/ContentLayout'
import Development from '@/components/ui/Development'

interface Props {
}

export default function AboutPage(props: Props) {

  return (<ContentLayout withFooter>
    <Development/>
  </ContentLayout>)
}