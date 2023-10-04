import CoursesMain from 'components/for_pages/courses'
import { CookiesType } from 'types/enums'

export const getServerSideProps = (async (context: { req: { cookies: { [x: string]: any } } }) => {
  const profileType = context.req.cookies[CookiesType.profileType]
  const token = context.req.cookies[CookiesType.accessToken]
  if(!profileType || !token) {
    return {
      redirect: {destination: '/login', permanent: false}   
    }
  }
  else {
    return {props: {}}
  }
}) 

export default function Courses() {
  return (
  <CoursesMain/>
  )
}