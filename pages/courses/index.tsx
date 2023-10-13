import CoursesMain from 'components/for_pages/courses'
import ContentLayout from 'components/layout/ContentLayout'
import { ICategory } from 'data/interfaces/Common'
import ICourse, { ICourseFeedback } from 'data/interfaces/ICourse'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import CoursesRepository from 'data/repositories/CoursesRepository'
import { CategoryType, Languages } from 'types/enums'
import Formatter from 'utils/formatter'

interface Props {
  categoryList: ICategory[]
  courses: ICourse[]
  popularCourses: ICourse[]
  compilations: ICategory[]
  feedbacks: ICourseFeedback[]
}

export const getServerSideProps = (async (context: { req: { cookies: { [x: string]: any } } }) => {
  const [
    categoryList, 
    allCompilations, 
    popularCourses, 
    allCourses,
    feedBacks
  ] = await Promise.all([
    ArticlesRepository.getCategoryList(CategoryType.Course, 1, 5), 
    ArticlesRepository.getCategoryList(CategoryType.CourseCompilation, 1, 10),
    CoursesRepository.getCourses({page: 1, limit: 10, categories: [30]},Languages.ru),
    CoursesRepository.getCourses({page: 1, limit: 20},Languages.ru),
    CoursesRepository.getFeedbacks(undefined,  1, 10, Languages.ru)
  ])
  const compilations = Formatter.randomElementsFromArray<ICategory>(allCompilations.data, 3)
  const courses = Formatter.randomElementsFromArray<ICategory>(allCourses.data, 5)
  return {props: {categoryList: categoryList.data, courses, compilations, popularCourses: popularCourses.data, feedbacks: feedBacks}}
}) 



export default function Courses(props: Props) {
  
  
  return (
    <ContentLayout title={'Курсы'}>
      <CoursesMain 
      categoryList={props.categoryList} 
      courses={props.courses} 
      popularCourses={props.popularCourses} 
      compilations={props.compilations}
      feedbacks={props.feedbacks}
      />
    </ContentLayout>
  )
}