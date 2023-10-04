import Image from 'next/image'
import courseImage from '../../../images/courses-main.webp'
import { useCoursesContext } from 'context/courses_state'
import { useEffect } from 'react'
import Formatter from 'utils/formatter'
import CourseItem from 'components/ui/CourseItem'
import styles from './index.module.scss'

interface Props {
}

export default function CoursesMain(props: Props) {
  const coursesContext = useCoursesContext()

  useEffect(()=>{
    coursesContext.setCoursesCategories()
    coursesContext.setCourses({page: 1, limit: 10, categories: [30]})
  }, [])

  return (<div className={styles.root}> 
    <div className={styles.top}>
      <h1 className={styles.title}>Станьте<br/> востребованным<br/> <span>специалистом</span></h1>
      <div className={styles.tagsWrapper}>
        {coursesContext.categories.length > 0 &&
          Formatter.randomElementsFromArray(coursesContext.categories, 4).map(el=> {
            return  <p className={styles.tag}>{el.name}</p>
          })
        }
      </div>
      
      <div className={styles.imageWrapper}>
        <Image className={styles.coursesImage} src={courseImage} alt={'courses image'}/>
      </div>
    </div>

    <p className={styles.coursesTitle}>Популярные курсы <Image src={'/icons/diamond.png'} alt={'diamond icon'} width={32} height={34}/></p>
    <div className={styles.coursesWrapper}>
      {coursesContext.courses.length > 0 &&
        coursesContext.courses.map(el => {
          return <CourseItem course={el} />
        })
      }
    </div>
  </div>)
}