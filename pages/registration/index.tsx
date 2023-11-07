import Registration from 'components/for_pages/registration'
import ContentLayout from 'components/layout/ContentLayout'
import { CookiesType } from 'types/enums'

interface Props {
}

export const getServerSideProps = (async (context: { req: { cookies: { [x: string]: any } } }) => {
  const profileType = context.req.cookies[CookiesType.profileType]
  const token = context.req.cookies[CookiesType.accessToken]
  if(token) {
    return {
      redirect: {destination: '/', permanent: false}   
    }
  }
  else {
    return {props: {}}
  }
}) 

export default function RegistrationPage(props: Props) {

  return ( 
    <ContentLayout title={'Регистрация'}>
      <Registration/>
    </ContentLayout>
  )
}