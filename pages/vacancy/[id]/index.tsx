import VacancyPage from 'components/for_pages/vacancy'
import ContentLayout from 'components/layout/ContentLayout'
import { PersonalWrapper } from 'context/personal_state'
import { VacancyWrapper } from 'context/vacancy_state'


interface Query {
  id: string
}

interface Props extends Query {
}

export const getServerSideProps = (async (context: { query: Query; req: { cookies: { [x: string]: any } } }) => {
  const id  = Number(context.query.id)
  // const profileType = context.req.cookies[CookiesType.profileType]
  // const token = context.req.cookies[CookiesType.accessToken]
  if(id === 0 || !id) {
    return {redirect: {destination: '/', permanent: false}}
  }
  return {props: {id}}
}) 

export default function Vacancy(props: Props) {

  return (
  <ContentLayout title='Вакансия' hideMobileHeader withFooter>
    <PersonalWrapper key={'vacancy_page'+props.id}>
      <VacancyWrapper>
        <VacancyPage id={Number(props.id)}/>
      </VacancyWrapper>
    </PersonalWrapper>
  </ContentLayout>
  )
}