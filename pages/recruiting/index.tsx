import RecruitingEmployee from 'components/for_pages/recruiting/RecruitingEmployee'
import RecruitingHirer from 'components/for_pages/recruiting/RecruitingHirer'
import RecruitingPageEmployee from 'components/for_pages/recruiting/RecruitingPageEmployee'
import RecruitingPageHirer from 'components/for_pages/recruiting/RecruitingPageHirer'
import ContentLayout from 'components/layout/ContentLayout'
import { useUserContext } from 'context/user_state'
import { ICV } from 'data/interfaces/ICV'
import { ProfileType } from 'data/interfaces/IRegistration'
import { IVacancy } from 'data/interfaces/IVacancy'
import VacancyRepository from 'data/repositories/VacancyRepository'
import { CookiesType } from 'types/enums'

interface Query {
  vcId?: number
  cvId?: number
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
  // const cvs = await CvRepository.findCvs({forLastNumberOfDays: 30})
  const vcId = context.query?.vcId||null
  const cvId = context.query?.cvId||null
  if(profile) {
    return {props: {profileType: profile, auth: token, vcId, cvId, vacancies: vacancies.slice(0, 10)}}
  }
  else {
    return {props: {vacancies: vacancies.slice(0, 10)}}
  }
}) 

export default function Recruiting(props: Props) {
  const userContext = useUserContext()
  const profileType = userContext.profileType

  return (<ContentLayout withFooter hideMobileHeader  title='Рекрутинг'>
    {!props.auth&&((props.profileType === ProfileType.Employee && profileType === ProfileType.Employee)||profileType === ProfileType.Employee) &&
      <RecruitingEmployee vacancies={props.vacancies} />
      ||
      !props.auth &&
      <RecruitingHirer cvs={props.cvs}/>
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