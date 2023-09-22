import ModulesPage from 'components/for_pages/courses/ModulesPage'
import ICourse, { ICourseBlock } from 'data/interfaces/ICourse'
import CoursesRepository from 'data/repositories/CoursesRepository'
import Head from 'next/head'
import { CookiesType } from 'types/enums'

interface Query {
  id: string
  block?: string
  module?: string
  step?: string
}

interface Props extends Query {
  course?: ICourse
  modules?: ICourseBlock[]
  blocks?: ICourseBlock[]
  initialBlock?: string
  initialStep?: string
}

export const getServerSideProps = (async (context: { query: Query; req: { cookies: { [x: string]: any } } }) => {
  const { id, module, block, step} = context.query  
  const initialBlock = context.query.block
  const initialStep = step
  const profileType = context.req.cookies[CookiesType.profileType]
  const language = context.req.cookies[CookiesType.language]
  const token = context.req.cookies[CookiesType.accessToken]
  if(profileType && language) {
    try {
      const course = await CoursesRepository.getCourseById(Number(id), token).then(res=> res)
      const blocks = await CoursesRepository.getCourseBlock(profileType, language, course.id, token).then(res=>res.data)
      const modules = await CoursesRepository.getCourseModules(Number(id), language, token)
      return {props: {course, id, modules, blocks, initialBlock, initialStep, module, block}}
    }
    catch(err) {
      return {props: {id: id}}
    }
  }

}) 

export default function CourseModulesPage(props: Props) {

  return (<>
    <Head>
      <title>Arbi Hunter|Курсы|{props.course?.name}</title>
      <meta name='description' content={props.course?.fullDescription}/>
    </Head>
    <ModulesPage course={props.course} modules={props.modules} initialStep={props.initialStep} id={props.id} blocks={props.blocks} initialBlock={props.initialBlock} module={props.module}/>
  </>)
}