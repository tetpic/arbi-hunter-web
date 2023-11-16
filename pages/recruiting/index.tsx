import RecruitingEmployee from 'components/for_pages/recruiting/RecruitingEmployee'
import RecruitingHirer from 'components/for_pages/recruiting/RecruitingHirer'
import RecruitingPageEmployee from 'components/for_pages/recruiting/RecruitingPageEmployee'
import RecruitingPageHirer from 'components/for_pages/recruiting/RecruitingPageHirer'
import ContentLayout from 'components/layout/ContentLayout'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import { CookiesType } from 'types/enums'

interface Props {
  profileType?: ProfileType
  auth?: boolean
}

export const getServerSideProps = (async (context: { req: { cookies: { [x: string]: any } } }) => {
  const token = context.req.cookies[CookiesType.accessToken]
  const profile = context.req.cookies[CookiesType.profileType]
  if(profile) {
    return {props: {profileType: profile, auth: token}}
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
    {!props.auth&&((props.profileType === ProfileType.Employee && profileType === ProfileType.Employee)||profileType === ProfileType.Employee) &&
      <RecruitingEmployee/>
      ||
      !props.auth &&
      <RecruitingHirer/>
    }
    {
      props.auth && props.profileType=== ProfileType.Employee &&
      <RecruitingPageEmployee/>
      ||
      <RecruitingPageHirer/>
    }
  </ContentLayout>)
}