import Profile from 'components/for_pages/profile'
import ContentLayout from 'components/layout/ContentLayout'
import { ProfilePageWrapper } from 'context/profile_page_state'
import { CookiesType } from 'types/enums'

interface Query {
  page: string
}

interface Props extends Query {

}

export const getServerSideProps = (async (context: {query: Query, req: { cookies: { [x: string]: any } } }) => {
  const page = context.query.page||null
  const profileType = context.req.cookies[CookiesType.profileType]
  const token = context.req.cookies[CookiesType.accessToken]
  if(profileType && token) {
    return {props: {page}}
  }
  else {
    return {redirect: {destination: '/login', permanent: false} }
  }
}) 

export default function ProfilePage(props: Props) {

  return (
    <ContentLayout title='Личный кабинет'>
      <ProfilePageWrapper page={props.page}>
        <Profile/>
      </ProfilePageWrapper>
    </ContentLayout>
 
  )
}