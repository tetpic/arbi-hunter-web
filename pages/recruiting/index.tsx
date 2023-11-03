import RecruitingEmployee from 'components/for_pages/recruiting/RecruitingEmployee'
import RecruitingHirer from 'components/for_pages/recruiting/RecruitingHirer'
import ContentLayout from 'components/layout/ContentLayout'
import { ProfileType } from 'data/interfaces/IRegistration'
import { CookiesType } from 'types/enums'

interface Props {
  profileType: ProfileType
}

export const getServerSideProps = (async (context: { req: { cookies: { [x: string]: any } } }) => {
  // const token = context.req.cookies[CookiesType.accessToken]
  const profile = context.req.cookies[CookiesType.profileType]
  // const isAuth = token&&profile
  return {props: {profileType: profile}}
}) 

export default function Recruiting(props: Props) {

  return (<ContentLayout>
    {props.profileType === ProfileType.Employee &&
      <RecruitingEmployee/>
      ||
      <RecruitingHirer/>
    }
  </ContentLayout>)
}