import MainLanding from 'components/for_pages/index/MainLanding'
import MainPageEmployee from 'components/for_pages/index/MainPageEmployee'
import MainPageHirer from 'components/for_pages/index/MainPageHirer'
import ContentLayout from 'components/layout/ContentLayout'
import { CharacterWrapper } from 'context/character_state'
import { PersonalWrapper } from 'context/personal_state'
import { VacancyWrapper } from 'context/vacancy_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import { CookiesType } from 'types/enums'

interface Query {
  socialAuth?: boolean
  token?: string
}

interface Props {
  profile?: ProfileType
}

export const getServerSideProps = (async (context: {req: { cookies: { [x: string]: any } }, query: Query }) => {
  const profile = context.req.cookies[CookiesType.profileType]
  const token = context.req.cookies[CookiesType.accessToken]
  const socialToken = context.query.token
  if(socialToken) {
    return {redirect: {destination: `/login?token=${socialToken}`}}
  }
  if(profile && token) {
    return {props: {profile}}
  }
  else {
    return {props: {}}
  }
}) 

export default function Page(props: Props) {
  return (
    <ContentLayout withFooter disabledNavBar={!props?.profile} withMobileMenu={Boolean(props?.profile)}>
      <VacancyWrapper>
        <PersonalWrapper>
        {
        props?.profile === ProfileType.Employee &&
        <CharacterWrapper>
          <MainPageEmployee/>
        </CharacterWrapper>
        ||
        props?.profile === ProfileType.Hirer &&
        <MainPageHirer/>
        ||
        <MainLanding/>
        }
        </PersonalWrapper>
      </VacancyWrapper>
    </ContentLayout>
  )
}