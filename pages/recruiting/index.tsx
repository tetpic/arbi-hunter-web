import RecruitingEmployee from 'components/for_pages/recruiting/RecruitingEmployee'
import RecruitingHirer from 'components/for_pages/recruiting/RecruitingHirer'
import RecruitingPageEmployee from 'components/for_pages/recruiting/RecruitingPageEmployee'
import RecruitingPageHirer from 'components/for_pages/recruiting/RecruitingPageHirer'
import ContentLayout from 'components/layout/ContentLayout'
import { CreateVcCvWrapper } from 'context/createVcCv_state'
import { LocationWrapper } from 'context/location_state'
import { SourcesWrapper } from 'context/sources_state'
import { useUserContext } from 'context/user_state'
import { IVacancyCvSearchParams } from 'data/interfaces/Common'
import { ICV } from 'data/interfaces/ICV'
import { ProfileType } from 'data/interfaces/IRegistration'
import { IVacancy } from 'data/interfaces/IVacancy'
import VacancyRepository from 'data/repositories/VacancyRepository'
import { CookiesType } from 'types/enums'

interface Query {
  vcId?: number
  cvId?: number
  filters?: string
  category?: number
}
interface Props extends Query {
  profileType?: ProfileType
  auth?: boolean
  vacancies?: IVacancy[]
  cvs?: ICV[]
}
export const getServerSideProps = (async (context: {query: Query, req: { cookies: { [x: string]: any } } }) => {
  const token = context.req.cookies[CookiesType.accessToken]||null
  const profile = context.req.cookies[CookiesType.profileType]||null
  const vacancies = await VacancyRepository.searchVacancies({forLastNumberOfDays: 30})
  const filters = context.query?.filters||null
  const vcId = context.query?.vcId||null
  const cvId = context.query?.cvId||null
  const category = context.query?.category||null
  if(profile) {
    return {props: {profileType: profile, auth: token, vcId, cvId, category, vacancies: vacancies.data.slice(0, 10), filters: filters||null}}
  }
  else {
    return {props: {vacancies: vacancies.data.slice(0, 10)}}
  }
}) 

export default function Recruiting(props: Props) {
  const userContext = useUserContext()
  const profileType = userContext.profileType
  const params: IVacancyCvSearchParams = props.filters&&JSON.parse(props.filters)||{}
  if(props.category) {
    params.categories = [props.category]
  }
  

  return (<ContentLayout withFooter hideMobileHeader  title='Рекрутинг'>
    <SourcesWrapper>
    <CreateVcCvWrapper>
    <LocationWrapper initials={{cities: params?.cities, countries: params?.countries}}>

      
      {!props.auth&&((props.profileType === ProfileType.Employee && profileType === ProfileType.Employee)||profileType === ProfileType.Employee) &&
        <RecruitingEmployee vacancies={props.vacancies} />
        ||
        !props.auth &&
        <RecruitingHirer cvs={props.cvs}/>
      }
      {
        props.auth && props.profileType=== ProfileType.Employee &&
          <RecruitingPageEmployee filters={params}/>
        ||
        props.auth && props.profileType === ProfileType.Hirer &&
        <RecruitingPageHirer vcId={Number(props.vcId)} filters={params}/>
      }

    </LocationWrapper>
    </CreateVcCvWrapper>
    </SourcesWrapper>
  </ContentLayout>)
}