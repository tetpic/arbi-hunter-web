import CurrentCourse, { CurrentCoursesNav } from 'components/for_pages/courses/CurrentCourse'
import CoursesRepository from 'data/repositories/CoursesRepository'
import { CookiesType} from 'types/enums'
import ICourse, { ICourseBlock } from 'data/interfaces/ICourse'
import ContentLayout from 'components/layout/ContentLayout'

interface Query {
  id: string
  page?: CurrentCoursesNav
}

export const getServerSideProps = (async (context: { query: Query; req: { cookies: { [x: string]: any } } }) => {
  const { id, page } = context.query  
  const profileType = context.req.cookies[CookiesType.profileType]
  const language = context.req.cookies[CookiesType.language]
  const token = context.req.cookies[CookiesType.accessToken]
  if(profileType && language) {
    try{
      const idInt = Number(id)
      const course = await CoursesRepository.getCourseById(idInt, token)
      const modules = await CoursesRepository.getCourseModules(idInt, language, token)
      const blocks = await CoursesRepository.getCourseBlock(profileType, language, idInt, token).then(res=>res.data)
      return {props: {course, id, page: page||null, modules, blocks}}
    }
    catch(err){
      return {props: {id: id}}
    }
  }
}) 


interface Props {
  course?: ICourse, 
  id: string, 
  modules?:ICourseBlock[] 
  blocks?: ICourseBlock[]
  page?: CurrentCoursesNav
}

export default function Course(props: Props) {
  return (
    <ContentLayout title={`Курсы|${props.course.name}`}>
      <CurrentCourse course={props.course} page={props.page} modules={props.modules} id={Number(props.id)} blocks={props.blocks}/>
    </ContentLayout>
  )
}


