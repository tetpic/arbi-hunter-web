import RecruitingEmployee from 'components/for_pages/recruiting/RecruitingEmployee'
import RecruitingHirer from 'components/for_pages/recruiting/RecruitingHirer'
import ContentLayout from 'components/layout/ContentLayout'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import { CookiesType } from 'types/enums'

interface Props {
  profileType?: ProfileType
}

export const getServerSideProps = (async (context: { req: { cookies: { [x: string]: any } } }) => {
  // const token = context.req.cookies[CookiesType.accessToken]
  const profile = context.req.cookies[CookiesType.profileType]
  if(profile) {
    return {props: {profileType: profile}}
  }
  else {
    return {props: {}}
  }
  // const isAuth = token&&profile
}) 

export default function Recruiting(props: Props) {
  const userContext = useUserContext()
  const profileType = userContext.profileType

  return (<ContentLayout withFooter>
    {((props.profileType === ProfileType.Employee && profileType === ProfileType.Employee)||profileType === ProfileType.Employee) &&
      <RecruitingEmployee/>
      ||
      <RecruitingHirer/>
    }
  </ContentLayout>)
}