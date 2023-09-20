import CurrentCourse from 'components/for_pages/courses/CurrentCourse'
import CoursesRepository from 'data/repositories/CoursesRepository'
import { CookiesType} from 'types/enums'
import ICourse from 'data/interfaces/ICourse'


export const getServerSideProps = (async (context: { query: { id: any }; req: { cookies: { [x: string]: any } } }) => {
  const { id } = context.query  
  const profileType = context.req.cookies[CookiesType.profileType]
  const language = context.req.cookies[CookiesType.language]
  const token = context.req.cookies[CookiesType.accessToken]
  if(profileType && language) {
    const course = await CoursesRepository.getCourseById(id, token).then(res=> res)
    return {props: {course: course, id: id}}
  }
  else {
    return {props: {id: id}}
  }
}) 

interface Props {
}

export default function Course(props: {course?: ICourse, id: string}) {
  return <CurrentCourse course={props.course} id={Number(props.id)}/>
}


