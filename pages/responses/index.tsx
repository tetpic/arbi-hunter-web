import Responses from '@/components/for_pages/responses'
import ContentLayout from '@/components/layout/ContentLayout'


interface Props {
}

export default function ResponsesPage(props: Props) {

  return (  
    <ContentLayout title={'Отклики'} hideMobileHeader>
      <Responses/>
    </ContentLayout>
  )
}