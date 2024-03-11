import CvPage from 'components/for_pages/cv'
import ContentLayout from 'components/layout/ContentLayout'
import { PersonalWrapper } from 'context/personal_state'
import { VacancyWrapper } from 'context/vacancy_state'

interface Query {
  id: string
}

interface Props extends Query {
}

export const getServerSideProps = (async (context: { query: Query; req: { cookies: { [x: string]: any } } }) => {
  const cvId  = Number(context.query.id)
  return {props: {id: cvId}}
}) 



export default function Cv(props: Props) {

  return (<ContentLayout title='Резюме' hideMobileHeader withFooter>
    <PersonalWrapper key={'cv_page'+props.id}>
      <VacancyWrapper>
        <CvPage cvId={props.id}/>
      </VacancyWrapper>
    </PersonalWrapper>
  </ContentLayout>)
}