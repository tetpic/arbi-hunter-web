import Registration from 'components/for_pages/registration'
import ContentLayout from 'components/layout/ContentLayout'
import UserRepository from 'data/repositories/UserRepository'
import useTranslation from 'next-translate/useTranslation'
import { CookiesType } from 'types/enums'

interface Query {
  token: string
}
 
interface Props extends Query {

} 



export const getServerSideProps = (async (context: { req: { cookies: { [x: string]: any } }, query: Query }) => {
  // return {
  //   redirect: {destination: '/', permanent: false}   
  // }
  const token = context.req.cookies[CookiesType.accessToken]
  const socialToken = context.query?.token
  if(token) {
    const res = await UserRepository.getCurrentUser(token)
    if(res.profiles.length === 0) return {props: {}}
    return {
      redirect: {destination: '/', permanent: false}   
    }
  }
  else if(socialToken) {
    return {props: {token: socialToken}}
  }
  else {
    return {props: {}}
  }
}) 

export default function RegistrationPage(props: Props) {
  const {t} = useTranslation()

  return ( 
    <ContentLayout title={t('registration')} hideMobileHeader>
      <Registration token={props.token}/>
    </ContentLayout>
  )
}