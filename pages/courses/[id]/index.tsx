import CurrentCourse, { CurrentCoursesNav } from 'components/for_pages/courses/CurrentCourse'
import CoursesRepository from 'data/repositories/CoursesRepository'
import { CookiesType} from 'types/enums'
import ICourse from 'data/interfaces/ICourse'
import ContentLayout from 'components/layout/ContentLayout'
import { CoursesWrapper } from 'context/courses_state'
import useTranslation from 'next-translate/useTranslation'

interface Query {
  id: string
  page?: CurrentCoursesNav
  course?: ICourse
}

export const getServerSideProps = (async (context: { query: Query; req: { cookies: { [x: string]: any } } }) => {
  const { id, page } = context.query  
  const profile = context.req.cookies[CookiesType.profileType]
  const token = context.req.cookies[CookiesType.accessToken]
  try{
    const idInt = Number(id)
    const course = await CoursesRepository.getCourseById(idInt, profile, token)
    return {props: {id, course, page: page||null}}
  }
  catch(err){
    return  {redirect: {destination: '/login', permanent: false}}
  }
}) 


interface Props {
  course?: ICourse, 
  id: string, 
  page?: CurrentCoursesNav
}

export default function Course(props: Props) {
  // console.count('course main refreshed')
  const {t} = useTranslation()
  return (
    <ContentLayout title={`${t('courses')} | ${props.course.name}`} hideMobileHeader>
      <CoursesWrapper>
        <CurrentCourse course={props.course} page={props.page} id={Number(props.id)}/>
      </CoursesWrapper>
    </ContentLayout>
  )
}


