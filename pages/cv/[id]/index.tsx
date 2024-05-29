import CvPage from 'components/for_pages/cv'
import ContentLayout from 'components/layout/ContentLayout'
import { FavoritesFolderWrapper } from 'context/favorites_folder_state'
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

  return (<ContentLayout title='Резюме' hideMobileHeader>
    <PersonalWrapper key={'cv_page'+props.id}>
      <VacancyWrapper>
        <FavoritesFolderWrapper>
        <CvPage cvId={props.id}/>
        </FavoritesFolderWrapper>
      </VacancyWrapper>
    </PersonalWrapper>
  </ContentLayout>)
}