import ModulesPage from 'components/for_pages/courses/ModulesPage'
import ContentLayout from 'components/layout/ContentLayout'
import { CoursesWrapper } from 'context/courses_state'
import ICourse from 'data/interfaces/ICourse'
import CoursesRepository from 'data/repositories/CoursesRepository'
import useTranslation from 'next-translate/useTranslation'
import { CookiesType } from 'types/enums'

interface Query {
  id: string
  block?: string
  module?: string
  step?: string
}

interface Props extends Query {
  course?: ICourse
}

export const getServerSideProps = (async (context: { query: Query; req: { cookies: { [x: string]: any } } }) => {
  const { id, module, block, step} = context.query  
  const profileType = context.req.cookies[CookiesType.profileType]
  const language = context.req.cookies[CookiesType.language]
  const token = context.req.cookies[CookiesType.accessToken]
  if(profileType && language) {
      const course = await CoursesRepository.getCourseById(Number(id), profileType, token).then(res=> res)
      return {props: {id, module, block, step, course}}
  }
  else {
    return {redirect: {destination: '/login', permanent: false}}
  }
}) 

export default function CourseModulesPage(props: Props) {
  const {t} = useTranslation()
 

  return (
    <ContentLayout title={`| ${t('courses_getThrough')} | ${+props.course?.name.toString()}`} hideMobileHeader>
      <CoursesWrapper  id={Number(props.id)} block={Number(props.block)} module={Number(props.module)} step={Number(props.step)} course={props.course} >
        <ModulesPage />
      </CoursesWrapper>
    </ContentLayout>
 )
}