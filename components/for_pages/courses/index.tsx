import Image from 'next/image'
import courseImage from '../../../images/courses-main.webp'
import { useCoursesContext } from 'context/courses_state'
import { useEffect } from 'react'
import Formatter from 'utils/formatter'
import { ICategory } from 'data/interfaces/Common'
import Categories from './Categories'
import ICourse, { ICourseFeedback } from 'data/interfaces/ICourse'
import CoursesBlock from './CoursesBlock'
import Benefits from './Benefits'
import Banner from './Banner'
import SearchBar from 'components/ui/SearchBar'
import Feedbacks from './Feedbacks'
import TitleDiamond from 'components/ui/TitleDiamond'
import LinkBlack from 'components/ui/LinkBlack'
import styles from './index.module.scss'

interface Props {
  categoryList: ICategory[]
  courses: ICourse[]
  compilations: ICategory[]
  popularCourses: ICourse[]
  feedbacks: ICourseFeedback[]
}

export default function CoursesMain(props: Props) {
  const coursesContext = useCoursesContext()
  const popularCourses = props.popularCourses

  
  useEffect(()=>{
    coursesContext.setCoursesCategories(props.categoryList)
    coursesContext.setCourses(null, props.courses)
  }, [])

  return <div className={styles.root}> 
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

    <SearchBar className={styles.search}/>
    <Benefits/>
    <Categories categoryList={props.categoryList}/>
    <Feedbacks feedbacks={props.feedbacks}/>
    <CoursesBlock title={'Популярные курсы'} courses={popularCourses}/>
    <section className={styles.banners}>
      <TitleDiamond title={'Подборки для вас'}/>
      <div className={styles.bannersWrapper}>
        <Banner className={styles.banner_small} category={props.compilations[0]}/>
        <Banner className={styles.banner_small} category={props.compilations[1]}/>
        <Banner className={styles.banner_large} category={props.compilations[2]}/>
        <LinkBlack href='/compilations'>Смотреть все</LinkBlack>
      </div>
    </section>
  </div>
}