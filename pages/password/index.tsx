import Password from 'components/for_pages/password'
import ContentLayout from 'components/layout/ContentLayout'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  isMobile: boolean
}

export default function PasswordPage(props: Props) { 
  const {t} = useTranslation()

  return ( 
    <ContentLayout title={t('login_restoringPassword')} hideMobileHeader>
      <Password/>
    </ContentLayout>
  )
}