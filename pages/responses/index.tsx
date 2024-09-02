import Responses from '@/components/for_pages/responses'
import ContentLayout from '@/components/layout/ContentLayout'
import useTranslation from 'next-translate/useTranslation'


interface Props {
}

export default function ResponsesPage(props: Props) {
  const {t} = useTranslation()

  return (  
    <ContentLayout title={t('responses')} hideMobileHeader>
      <Responses/>
    </ContentLayout>
  )
}