import Password from 'components/for_pages/password'
import ContentLayout from 'components/layout/ContentLayout'

interface Props {
  isMobile: boolean
}

export default function PasswordPage(props: Props) { 

  return ( 
    <ContentLayout>
      <Password/>
    </ContentLayout>
  )
}