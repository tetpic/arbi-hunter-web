import { CookiesType } from 'types/enums'
import CommunitiesPage from 'components/for_pages/communities'

interface Props {
}

export const getServerSideProps = (async (context: { req: { cookies: { [x: string]: any } } }) => {
    const profileType = context.req.cookies[CookiesType.profileType]
    const token = context.req.cookies[CookiesType.accessToken]
    if(!profileType || !token) {
      return {
        redirect: {destination: '/login', permanent: false}   
      }
    }
    else {
      return {props: {}}
    }
  }) 

export default function Communities(props: Props) {

  return (<CommunitiesPage/>)
}