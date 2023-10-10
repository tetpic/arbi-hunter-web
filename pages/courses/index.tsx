import CoursesMain from 'components/for_pages/courses'
import { ICategory } from 'data/interfaces/Common'
import ICourse from 'data/interfaces/ICourse'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import CoursesRepository from 'data/repositories/CoursesRepository'
import { CategoryType, /*CookiesType, */ Languages } from 'types/enums'
import Formatter from 'utils/formatter'

interface Props {
  categoryList: ICategory[]
  courses: ICourse[]
  popularCourses: ICourse[]
  compilations: ICategory[]
}

export const getServerSideProps = (async (context: { req: { cookies: { [x: string]: any } } }) => {
  const categoryList = (await ArticlesRepository.getCategoryList(CategoryType.Course, 1, 5)).data
  const allCompilations = (await ArticlesRepository.getCategoryList(CategoryType.CourseCompilation, 1, 10)).data
  const compilations = Formatter.randomElementsFromArray<ICategory>(allCompilations, 2)
  const popularCourses = (await CoursesRepository.getCourses({page: 1, limit: 10, categories: [30]},Languages.ru)).data
  const allCourses = (await CoursesRepository.getCourses({page: 1, limit: 20},Languages.ru)).data
  const courses = Formatter.randomElementsFromArray<ICategory>(allCourses, 5)
  return {props: {categoryList, courses, compilations, popularCourses}}
}) 



export default function Courses(props: Props) {
  return (
  <CoursesMain 
  categoryList={props.categoryList} 
  courses={props.courses} 
  popularCourses={props.popularCourses} 
  compilations={props.compilations}/>
  )
}