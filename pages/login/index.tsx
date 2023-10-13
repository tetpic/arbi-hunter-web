import Login from 'components/for_pages/login'
import ContentLayout from 'components/layout/ContentLayout'

interface Props {
  isMobile: boolean
}

export default function LoginPage(props: Props) { 

  return ( 
    <ContentLayout>
      <Login/>
    </ContentLayout>
  )
}