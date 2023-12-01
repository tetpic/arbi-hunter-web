import styles from './index.module.scss'

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
import LinkBlack from 'components/ui/LinkBlack'
import { useResize } from 'components/hooks/useResize'
import Title from 'components/ui/TitleForSection'
import classnames from 'classnames'


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
  const {isTabletWidth} = useResize()

  
  useEffect(()=>{
    coursesContext.setCoursesCategories(props.categoryList)
    coursesContext.setCourses(null, props.courses)
  }, [])

  return <div className={styles.root}> 
     {isTabletWidth &&
      <SearchBar className={styles.search}/>
    }
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
    {!isTabletWidth &&
      <SearchBar className={styles.search}/>
    }

    <Benefits/>

    <Title className={classnames(styles.sectionTitle, styles.sectionTitle_noLink)} title={'Категории'}/>
    <Categories categoryList={props.categoryList}/>
    {!isTabletWidth &&
    <LinkBlack href='/courses/compilations?page=all'>Смотреть все</LinkBlack>
    }

    <Title 
    className={styles.sectionTitle} 
    title={isTabletWidth?'Подборки':'Подборки для вас'} 
    link='/categories'
    emoji={!isTabletWidth&&<Image src={'/icons/diamond.png'} alt={'diamond'} width={32} height={32}/>}
    />
    <section className={styles.banners}>
      <div className={styles.bannersWrapper}>
        <Banner className={styles.banner_small} colorGradient={['#37BFAE', '#7D5CFF']} category={props.compilations[0]}/>
        <Banner className={styles.banner_small} colorGradient={['#AD36C7', '#7D5CFF']} category={props.compilations[1]}/>
        <Banner className={styles.banner_large} colorGradient={['#9365CA', '#4E5FBF']} category={props.compilations[2]}/>
      </div>
    </section>
    {!isTabletWidth &&
    <LinkBlack href='/courses/compilations?page=categories'>Смотреть все</LinkBlack>
    }

    <Title className={styles.sectionTitle} title={isTabletWidth?'Отзывы':'Отзывы учеников'} link='/feedbacks'/>
    <Feedbacks feedbacks={props.feedbacks}/>
    {!isTabletWidth &&
      <LinkBlack href={'/feedbacks'}>Смотреть все</LinkBlack>
    }

    <Title 
    title={isTabletWidth?'Популярное':'Популярные курсы'}
    link='/courses'
    className={styles.sectionTitle} 
    emoji={!isTabletWidth&&<Image src={'/icons/diamond.png'} alt={'diamond'} width={32} height={32}/>}
    />
    <CoursesBlock courses={popularCourses}/>
    {!isTabletWidth &&
    <LinkBlack href='/courses/compilations?page=all'>Смотреть все</LinkBlack>
    }
  </div>
}