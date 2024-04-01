import Login from 'components/for_pages/login'
import ContentLayout from 'components/layout/ContentLayout'
import { useUserContext } from 'context/user_state'
import UserRepository from 'data/repositories/UserRepository'
import { useRouter } from 'next/router'

interface Props {
  isMobile: boolean
  token?: string
}

export const getServerSideProps = (async (context: {query: {token: string}}) => {
  const token = context.query?.token
  if(token) {
    const user = await UserRepository.getCurrentUser(token)
    if(user.isRegistrationCompleted) {
      return {props: {token: token}}
    }
    else {
      return {redirect: {destination: '/registration?token='+token, permanent: false}}
    }
  }
  return {props: {}}
}) 


export default function LoginPage(props: Props) { 
  const userContext = useUserContext()
  const router = useRouter()
  if(props.token) {
    userContext.setToken(props.token)
    .then(res=> {
      router.replace('/')
    })
  }

  return ( 
    <ContentLayout hideMobileHeader>
      <Login/>
    </ContentLayout>
  )
}