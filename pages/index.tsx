import MainLanding from 'components/for_pages/index/MainLanding'
import MainPageEmployee from 'components/for_pages/index/MainPageEmployee'
import MainPageHirer from 'components/for_pages/index/MainPageHirer'
import ContentLayout from 'components/layout/ContentLayout'
import { CharacterWrapper } from 'context/character_state'
import { PersonalWrapper } from 'context/personal_state'
import { useAppContext } from 'context/state'
import { VacancyWrapper } from 'context/vacancy_state'
import { IBackground } from 'data/interfaces/IBackground'
import { IPersonalPage } from 'data/interfaces/IPersonal'
import { ProfileType } from 'data/interfaces/IRegistration'
import { IUserProfile } from 'data/interfaces/IUser'
import BackgroundRepository from 'data/repositories/BackgroundsRepository'
import PersonalRepository from 'data/repositories/PersonalRepository'
import UserRepository from 'data/repositories/UserRepository'
import { CookiesType } from 'types/enums'

interface Query {
  socialAuth?: boolean
  token?: string
}

interface Props {
  profileType?: ProfileType
  profile?: IUserProfile
  backgrounds?: IBackground[]
  personalPage: IPersonalPage
}

export const getServerSideProps = (async (context: {req: { cookies: { [x: string]: any } }, query: Query }) => {
  const profileType = context.req.cookies[CookiesType.profileType]
  const token = context.req.cookies[CookiesType.accessToken]
  const socialToken = context.query.token
  if(socialToken) {
    return {redirect: {destination: `/login?token=${socialToken}`}}
  }
  if(profileType && token) {
    const user = await UserRepository.getCurrentUser(token)
    const currentProfile = user.profiles[0]
    const personalPage = await PersonalRepository.getPersonalPageById(currentProfile.id)
    const backgrounds = await BackgroundRepository.getBackground({profileId: currentProfile?.id}, token, profileType)
    return {props: {profileType, profile:currentProfile, backgrounds, personalPage}}
  }
  else {
    return {props: {}}
  }
}) 

export default function Page(props: Props) {
  const {isTabletWidth} = useAppContext().size  
  
  return (
    <ContentLayout 
    title={'Главная страница'} 
    description='ArbiHunter — HR-сервис будущего. Создай профиль, заполни резюме и получи job offer в арбитраже трафика прямо сейчас!'  
    withFooter={!isTabletWidth || !Boolean(props?.profile)}disabledNavBar={!props?.profile} 
    withMobileMenu={Boolean(props?.profile)}>
      <PersonalWrapper profile={props?.profile} initialBacks={props?.backgrounds} personalPage={props?.personalPage}>
      <VacancyWrapper>
        {
        props?.profile?.profileType === ProfileType.Employee &&
        <CharacterWrapper>
          <MainPageEmployee/>
        </CharacterWrapper>
        ||
        props?.profile?.profileType === ProfileType.Hirer &&
        <MainPageHirer/>
        ||
        <MainLanding/>
        }
      </VacancyWrapper>
      </PersonalWrapper>
    </ContentLayout>
  )
}