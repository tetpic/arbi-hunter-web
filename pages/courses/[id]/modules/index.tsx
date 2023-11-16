import ModulesPage from 'components/for_pages/courses/ModulesPage'
import ContentLayout from 'components/layout/ContentLayout'
import { CoursesWrapper } from 'context/courses_state'
import ICourse from 'data/interfaces/ICourse'
import CoursesRepository from 'data/repositories/CoursesRepository'
import { CookiesType } from 'types/enums'

interface Query {
  id: string
  block?: string
  module?: string
  step?: string
}

interface Props extends Query {
  course?: ICourse
  // modules?: ICourseBlock[]
  // blocks?: ICourseBlock[]
  // initialBlock?: string
  // initialStep?: string
}

export const getServerSideProps = (async (context: { query: Query; req: { cookies: { [x: string]: any } } }) => {
  const { id, module, block, step} = context.query  
  const profileType = context.req.cookies[CookiesType.profileType]
  const language = context.req.cookies[CookiesType.language]
  const token = context.req.cookies[CookiesType.accessToken]
  if(profileType && language) {
      const course = await CoursesRepository.getCourseById(Number(id), profileType, token).then(res=> res)
      // const blocks = await CoursesRepository.getCourseBlock(language, course.id).then(res=>res.data)
      // const modules = await CoursesRepository.getCourseModules(Number(id), language)
      return {props: {id, module, block, step, course}}
  }
  else {
    return {redirect: {destination: '/login', permanent: false}}
  }
}) 

export default function CourseModulesPage(props: Props) {
 

  return (
    <ContentLayout title={`|Прохождение курса|${+props.course?.name.toString()}`}>
      <CoursesWrapper  id={Number(props.id)} block={Number(props.block)} module={Number(props.module)} step={Number(props.step)} course={props.course} >
        <ModulesPage />
      </CoursesWrapper>
    </ContentLayout>
 )
}