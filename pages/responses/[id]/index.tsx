import Responses from 'components/for_pages/responses'
import ContentLayout from 'components/layout/ContentLayout'
import { ProfileType } from 'data/interfaces/IRegistration'
import { CookiesType } from 'types/enums'

interface Query {
  id: string
}

interface Props extends Query {
}

export const getServerSideProps = (async (context: {query: Query, req: { cookies: { [x: string]: any } } }) => {
  const profileType = context.req.cookies[CookiesType.profileType]
  const token = context.req.cookies[CookiesType.accessToken]
  const {id} = context.query
  if(profileType && profileType === ProfileType.Hirer && token) {
    return {props: {id}}
  }
  else {    
    return {
      redirect: {destination: '/', permanent: false}   
    }
  }
}) 


export default function ResponseItem(props: Props) {
  
  return ( 
    <ContentLayout title={'Отклики'} hideMobileHeader>
      <Responses id={Number(props.id)}/>
    </ContentLayout>
  )
}