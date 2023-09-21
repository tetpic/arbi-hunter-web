import ModulesPage from 'components/for_pages/courses/ModulesPage'
import ICourse, { ICourseBlock } from 'data/interfaces/ICourse'
import CoursesRepository from 'data/repositories/CoursesRepository'
import { CookiesType } from 'types/enums'

interface Query {
  id: string
  block?: string
  step?: string
}

interface Props extends Query {
  course?: ICourse
  modules?: ICourseBlock[]
}

export const getServerSideProps = (async (context: { query: Query; req: { cookies: { [x: string]: any } } }) => {
  const { id, block, step } = context.query  
  const profileType = context.req.cookies[CookiesType.profileType]
  const language = context.req.cookies[CookiesType.language]
  const token = context.req.cookies[CookiesType.accessToken]
  if(profileType && language) {
    try {
      const course = await CoursesRepository.getCourseById(Number(id), token).then(res=> res)
      const modules = await CoursesRepository.getCourseBlock(profileType, language, course.id, token).then(res=>res.data)
      return {props: {course, id, modules, block, step}}
    }
    catch {
      return {props: {id: id}}
    }
  }

}) 

export default function CourseModulesPage(props: Props) {
  return (<ModulesPage course={props.course} modules={props.modules} id={props.id} block={props.block} step={props.step}/>)
}