import Login from 'components/for_pages/login'
import ContentLayout from 'components/layout/ContentLayout'
import { useUserContext } from 'context/user_state'
import UserRepository from 'data/repositories/UserRepository'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { CookiesType } from 'types/enums'

interface Props {
  isMobile: boolean
  queryToken?: string
}

export const getServerSideProps = (async (context: {query: {token: string}}) => {
  const queryToken = context.query?.token
  const token = Cookies.get(CookiesType.accessToken)
  if(queryToken) {
    const user = await UserRepository.getCurrentUser(queryToken)
    if(!user.isRegistrationCompleted || user.profiles.length === 0) {
      Cookies.remove(CookiesType.accessToken)
      return {props: {}}
    }
    if(user.isRegistrationCompleted) {
      return {props: {queryToken}}
    }
    else {
      return {redirect: {destination: '/registration?token='+queryToken, permanent: false}}
    }
  }
  else if(token) {
    Cookies.remove(CookiesType.accessToken)
    return {props: {}}
  }
  else {
    return {props: {}}
  }
}) 


export default function LoginPage(props: Props) { 
  const userContext = useUserContext()
  const router = useRouter()
  if(props.queryToken) {
    userContext.setToken(props.queryToken)
    .then(_=> {
      router.push('/')
    })
  }

  return ( 
    <ContentLayout hideMobileHeader>
      <Login/>
    </ContentLayout>
  )
}