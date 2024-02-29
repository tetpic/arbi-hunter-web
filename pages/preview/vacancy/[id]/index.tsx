import { VacancyWrapper } from 'context/vacancy_state'
import ContentLayout from '@/components/layout/ContentLayout'
import VacancyPreview from '@/components/for_pages/preview/vacancy'
import { CookiesType } from 'types/enums'
import VacancyRepository from 'data/repositories/VacancyRepository'
import UserRepository from 'data/repositories/UserRepository'
import { IVacancy } from 'data/interfaces/IVacancy'



interface Query {
  id: number
  vacancy?: IVacancy
}

interface Props extends Query {}

export const getServerSideProps = (async (context: {query: Query, req: { cookies: { [x: string]: any } } }) => {
  const token = context.req.cookies[CookiesType.accessToken]||null
  const profile = context.req.cookies[CookiesType.profileType]||null
  const id = context.query?.id
  if(!token || !profile|| !id) {
    return {redirect: {destination: '/'}}
  }
  const vacancy = await VacancyRepository.getVacancyById(id, profile, token)
  const user = await UserRepository.getCurrentUser(token)
  if(user.profiles[0].id === vacancy.profile.id) {
    return {props: {id: Number(id), vacancy: vacancy}}
  }
  else {
    return {redirect: {destination: '/'}}
  }
}) 

export default function VacancyPreviewPage(props: Props) {

  return (
    <ContentLayout withFooter>
      <VacancyWrapper vacancy={props.vacancy}>
        <VacancyPreview id={props.id}/>
      </VacancyWrapper>
    </ContentLayout>
  )
}