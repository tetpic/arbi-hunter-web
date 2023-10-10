import Image from 'next/image'
import courseImage from '../../../images/courses-main.webp'
import { useCoursesContext } from 'context/courses_state'
import { useEffect } from 'react'
import Formatter from 'utils/formatter'
import { ICategory } from 'data/interfaces/Common'
import MediaSearch from 'components/ui/MediaSearch'
import Categories from './Categories'
import ICourse from 'data/interfaces/ICourse'
import CoursesBlock from './CoursesBlock'
import styles from './index.module.scss'
import Benefits from './Benefits'
import Banner from './Banner'

interface Props {
  categoryList: ICategory[]
  courses: ICourse[]
  compilations: ICategory[]
  popularCourses: ICourse[]
}

export default function CoursesMain(props: Props) {
  const coursesContext = useCoursesContext()
  const courses = props.courses||coursesContext.courses
  const popularCourses = props.popularCourses

  
  useEffect(()=>{
    coursesContext.setCoursesCategories(props.categoryList)
    coursesContext.setCourses(null, props.courses)
  }, [])

  return (<div className={styles.root}> 
    <div className={styles.top}>
      <h1 className={styles.title}>Станьте<br/> востребованным<br/> специалистом</h1>
      <div className={styles.tagsWrapper}>
        {coursesContext.categories.length > 0 &&
          Formatter.randomElementsFromArray<ICategory>(coursesContext.categories, 4).map(el=> {
            return  <p className={styles.tag} key={el.id}>{el.name}</p>
          })
        }
      </div>
      
      <div className={styles.imageWrapper}>
        <Image className={styles.coursesImage} src={courseImage} alt={'courses image'}/>
      </div>
    </div>

    <MediaSearch className={styles.search}/>
    <Categories categoryList={props.categoryList}/>
    <CoursesBlock title={'Популярные курсы'} courses={popularCourses}/>
    <Benefits/>
    
    <Banner category={props.compilations[0]}/>
    <CoursesBlock title={'Лучшие курсы'} courses={courses}/>
    <Banner category={props.compilations[1]}/>
  </div>)
}