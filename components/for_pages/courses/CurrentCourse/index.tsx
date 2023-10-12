import ItemNavigation from 'components/for_pages/profile/ItemNavigation'
import { useResize } from 'components/hooks/useResize'
import BookMarkSvg from 'components/svg/BookMarkSvg'
import ShareSvg from 'components/svg/ShareSvg'
import SmallStarActiveSvg from 'components/svg/SmallStarSvg'
import UserSvg from 'components/svg/UserSvg'
import BackBtn from 'components/ui/BackBtn'
import Button from 'components/ui/Button'
import IconButton from 'components/ui/IconButton'
import Navigation from 'components/ui/Navigation'
import Spinner from 'components/ui/Spinner'
import { useCoursesContext } from 'context/courses_state'
import ICourse, { ICourseBlock } from 'data/interfaces/ICourse'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { colors } from 'styles/variables'
import { FILES } from 'types/constants'
import { NavigationSet } from 'types/types'
import Formatter from 'utils/formatter'
import CourseFeedbacks from './CourseFeedbacks'
import CoursesInformation from './CourseInformation'
import CourseModules from './CourseModules'
import CourseNews from './CourseNews'
import styles from './index.module.scss'
import RatingLine from 'components/ui/RatingLine'

interface Props {
  id: number
  course: ICourse
  modules: ICourseBlock[]
  blocks: ICourseBlock[]
  page?: CurrentCoursesNav
}

export enum CurrentCoursesNav {
  Information='information',
  Feedbacks='feedbacks',
  Modules='modules',
  News='news'
}

export default function CurrentCourse(props: Props) {
  const {isTabletWidth} = useResize()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const {currentCourse, setCurrentCourse, clearModules, courseStats, setCourseModules, setCourseBlocks} = useCoursesContext()
  const [page, setPage] = useState<CurrentCoursesNav>(props.page||CurrentCoursesNav.Information)
  const course = props.course || currentCourse
  
  const body = (()=>{
    switch(page) {
      case CurrentCoursesNav.Information:
        return <CoursesInformation course={course} isMobile={isTabletWidth}/>
      case CurrentCoursesNav.Feedbacks:
        return <CourseFeedbacks id={props.id}/>
        case CurrentCoursesNav.Modules:
          return <CourseModules course={course} modules={props.modules}/>
          case CurrentCoursesNav.News:
        return <CourseNews id={props.id}/>
      }
    }
  )()
  
  const pager = (p: CurrentCoursesNav) => {
    setPage(p)    
  }
  
  const availablePages = Object.values(CurrentCoursesNav)

  const navSet = useCallback(((): NavigationSet<CurrentCoursesNav>[] => {
    let result:{name: string, type: CurrentCoursesNav, icon?: JSX.Element}[]  = []
    result = Object.values(availablePages).map(page => {
      switch(page) {
        case CurrentCoursesNav.Information:
        return {name: 'Информация', type: page}

        case CurrentCoursesNav.Modules:
        return {name: 'Модули', type: page}

        case CurrentCoursesNav.Feedbacks:
        return {name: 'Отзывы', type: page}

        case CurrentCoursesNav.News:
        return {name: 'Новости', type: page,}
      }
    })
    return result
  } ), [page])

  useEffect(()=>{    
    pager(page)
    router.replace({
      query: { ...router.query, page: page },
    }, undefined, {shallow: true})
  }, [page])

  useEffect(()=>{
    setCourseModules(props.id, props.modules)
    setCourseBlocks(props.id, props.blocks)
    setCurrentCourse(props.id, props.course)
    .then(()=> 
      setLoading(false)
    )
    return ()=>{
      clearModules()
    }
  }, [])

  return (<div className={styles.root}> 
    <div className={styles.header}>
      {course && 
      <>
        <div className={styles.content}>
          <p className={styles.title}>{course.name}</p>
          {isTabletWidth && 
            <p className={styles.titleStats}><SmallStarActiveSvg/> <span className={styles.yellow}>{(course.rating||0) + ' из 5'}</span> <UserSvg/> {course.completedCount} </p>
          }
          {!isTabletWidth && <>
            <p className={styles.description}>{course.shortDescription}</p>
            <p className={styles.price}>
              <Image src={'/icons/money.png'} alt={'money icon'} width={24} height={24}/>
              {Formatter.formatPrice(course.price)}
            </p>
            <div className={styles.buttonsWrapper}>
              <Button className={styles.buttonYellow}>Купить курс</Button>
              <Button className={styles.buttonWhite}>Попробовать бесплатно</Button>
            </div>
          </>}
          {isTabletWidth && 
            <ItemNavigation bottomStringClass={styles.bottomString} className={styles.mobileNavigation} activeItem={page} items={navSet()} onClick={pager}/>
          }
         
        </div>
        <Image className={styles.courseImage} src={FILES + course.image.source} alt={course.name} fill/>
          <div className={styles.iconButtonsWrapper}>
            <IconButton className={styles.iconButton} bgColor={'transparent'}>
              <ShareSvg/>
            </IconButton>
            {!isTabletWidth &&
            <IconButton className={styles.iconButton} bgColor={'transparent'}>
              <BookMarkSvg/>
            </IconButton>
            ||
            <BackBtn className={styles.iconButton} onClick={()=>{router.push('/courses/')}} bgColor={'transparent'}/>
            }
          </div>
      </>
      ||
      <Spinner size={36} color={colors.yellow}/>
      }
    </div>
    <div className={styles.wrapper}>
      <div className={styles.mainContent}>
        {course&&body||<Spinner size={32}/>}
      </div>
      <div className={styles.right}>
        {!isTabletWidth &&
          <Navigation rootClassName={styles.navigation} setPage={pager} navSet={navSet()} currentPage={page}/>
        }
        {page === CurrentCoursesNav.Feedbacks && courseStats && courseStats.raiting &&
          <div className={styles.stats}>
            <div className={styles.statsLeft}>
              <p className={styles.rating}>{courseStats.raiting.raiting}</p>
              <RatingLine rating={courseStats.raiting.raiting}/>
              <p className={styles.counter}>{courseStats.count} {Formatter.pluralize(courseStats.count, 'отзыв', 'отзыва', 'отзывов')}</p>
            </div>
            <div className={styles.statsRight}>
              {courseStats.stats.map((el, index)=> {
                return (
                  <div key={index} className={styles.lineWrapper}>
                    <p className={styles.lineText}>{el.mark}</p>
                    <div className={styles.line}>
                      <div className={styles.progress} style={{width : `${(Number(el.count) / courseStats.count) * 100}%`}}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        }
      </div>
    </div>
  </div>)
}