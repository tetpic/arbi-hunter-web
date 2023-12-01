import CoursesCompilations, { CompilationsNav } from 'components/for_pages/courses/CompilationsPage'
import ContentLayout from 'components/layout/ContentLayout'
import { CoursesWrapper } from 'context/courses_state'

interface Query {
  page?: CompilationsNav
  category?: number
}

interface Props extends Query {}

export const getServerSideProps = (async (context: {query: Query, req: { cookies: { [x: string]: any } } }) => {
  const page = context.query.page||null
  const category = Number(context.query.category)||null
  return {props: {page, category}}
}) 

export default function Compilations(props: Props) {


  return (
    <ContentLayout>
      <CoursesWrapper>
        <CoursesCompilations page={props.page} category={props.category}/>
      </CoursesWrapper>
    </ContentLayout>
  )
}