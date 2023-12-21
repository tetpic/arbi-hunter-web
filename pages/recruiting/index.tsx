import RecruitingEmployee from 'components/for_pages/recruiting/RecruitingEmployee'
import RecruitingHirer from 'components/for_pages/recruiting/RecruitingHirer'
import RecruitingPageEmployee from 'components/for_pages/recruiting/RecruitingPageEmployee'
import RecruitingPageHirer from 'components/for_pages/recruiting/RecruitingPageHirer'
import ContentLayout from 'components/layout/ContentLayout'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import { CookiesType } from 'types/enums'

interface Query {
  vcId?: number
  cvId?: number
}
interface Props extends Query {
  profileType?: ProfileType
  auth?: boolean
}
export const getServerSideProps = (async (context: {query: Query, req: { cookies: { [x: string]: any } } }) => {
  const token = context.req.cookies[CookiesType.accessToken]||null
  const profile = context.req.cookies[CookiesType.profileType]||null
  const vcId = context.query?.vcId||null
  const cvId = context.query?.cvId||null
  if(profile) {
    return {props: {profileType: profile, auth: token, vcId, cvId}}
  }
  else {
    return {props: {}}
  }
}) 

export default function Recruiting(props: Props) {
  const userContext = useUserContext()
  const profileType = userContext.profileType

  return (<ContentLayout withFooter hideMobileHeader  title='Рекрутинг'>
    {!props.auth&&((props.profileType === ProfileType.Employee && profileType === ProfileType.Employee)||profileType === ProfileType.Employee) &&
      <RecruitingEmployee/>
      ||
      !props.auth &&
      <RecruitingHirer/>
    }
    {
      props.auth && props.profileType=== ProfileType.Employee &&
      <RecruitingPageEmployee />
      ||
      props.auth && props.profileType === ProfileType.Hirer &&
      <RecruitingPageHirer vcId={Number(props.vcId)} />
    }
  </ContentLayout>)
}