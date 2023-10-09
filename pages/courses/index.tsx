import CoursesMain from 'components/for_pages/courses'
import { ICategory } from 'data/interfaces/Common'
import ICourse from 'data/interfaces/ICourse'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import CoursesRepository from 'data/repositories/CoursesRepository'
import { CategoryType, CookiesType, Languages } from 'types/enums'

interface Props {
  categoryList: ICategory[]
  courses: ICourse[]
}

export const getServerSideProps = (async (context: { req: { cookies: { [x: string]: any } } }) => {
  const profileType = context.req.cookies[CookiesType.profileType]
  const token = context.req.cookies[CookiesType.accessToken]
  if(!profileType || !token) {
    return {
      redirect: {destination: '/login', permanent: false}   
    }
  }
  else {
    const categoryList = (await ArticlesRepository.getCategoryList(CategoryType.Course, 1, 5, token)).data
    const courses = (await CoursesRepository.getCourses({page: 1, limit: 10, categories: [30]},Languages.ru)).data
    return {props: {categoryList, courses}}
  }
}) 



export default function Courses(props: Props) {
  return (
  <CoursesMain categoryList={props.categoryList} courses={props.courses}/>
  )
}