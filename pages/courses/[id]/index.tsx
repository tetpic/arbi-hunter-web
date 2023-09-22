import CurrentCourse, { CurrentCoursesNav } from 'components/for_pages/courses/CurrentCourse'
import CoursesRepository from 'data/repositories/CoursesRepository'
import { CookiesType} from 'types/enums'
import ICourse, { ICourseBlock } from 'data/interfaces/ICourse'
import Head from 'next/head'

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
    <>
      <Head>
        <title>Arbi Hunter|Курсы|{props.course?.name}</title>
        <meta name='description' content={props?.course?.fullDescription}/>
      </Head>
      <CurrentCourse course={props.course} page={props.page} modules={props.modules} id={Number(props.id)} blocks={props.blocks}/>
    </>
  )
}


