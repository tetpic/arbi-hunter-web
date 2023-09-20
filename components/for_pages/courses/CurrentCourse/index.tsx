import BookMarkSvg from 'components/svg/BookMarkSvg'
import ShareSvg from 'components/svg/ShareSvg'
import Button from 'components/ui/Button'
import IconButton from 'components/ui/IconButton'
import Navigation from 'components/ui/Navigation'
import Spinner from 'components/ui/Spinner'
import { useCoursesContext } from 'context/courses_state'
import ICourse from 'data/interfaces/ICourse'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { colors } from 'styles/variables'
import { NavigationSet } from 'types/types'
import Formatter from 'utils/formatter'
import CourseFeedbacks from './CourseFeedbacks'
import CoursesInformation from './CourseInformation'
import CourseModules from './CourseModules'
import CourseNews from './CourseNews'
import styles from './index.module.scss'

interface Props {
  id: number
  course: ICourse
}

enum CurrentCoursesNav {
  Information='information',
  Modules='modules',
  Feedbacks='feedbacks',
  News='news'
}

export default function CurrentCourse(props: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const {currentCourse, setCurrentCourse, clearModules} = useCoursesContext()
  const [page, setPage] = useState<CurrentCoursesNav>(CurrentCoursesNav.Information)
  const filePath = process.env.files
  const course = props.course || currentCourse
  
  const body = (()=>{
    switch(page) {
      case CurrentCoursesNav.Information:
        return <CoursesInformation course={course}/>
      case CurrentCoursesNav.Feedbacks:
        return <CourseFeedbacks id={props.id}/>
        case CurrentCoursesNav.Modules:
          return <CourseModules course={course}/>
          case CurrentCoursesNav.News:
        return <CourseNews/>
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
    })
  }, [page])

  useEffect(()=>{
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
      {!loading && 
      <>
        <div className={styles.content}>
          <p className={styles.title}>{course.name}</p>
          <p className={styles.description}>{course.shortDescription}</p>
          <p className={styles.price}>
            <Image src={'/icons/money.png'} alt={'money icon'} width={24} height={24}/>
            {Formatter.formatPrice(course.price)}
          </p>
          <div className={styles.buttonsWrapper}>
            <Button className={styles.buttonYellow}>Купить курс</Button>
            <Button className={styles.buttonWhite}>Попробовать бесплатно</Button>
          </div>
        </div>
        <Image className={styles.courseImage} src={filePath + course.image.source} alt={course.name} width={180} height={180}/>
        <div className={styles.iconButtonsWrapper}>
          <IconButton className={styles.iconButton} bgColor={'transparent'}>
            <ShareSvg/>
          </IconButton>
          <IconButton className={styles.iconButton} bgColor={'transparent'}>
            <BookMarkSvg/>
          </IconButton>
        </div>
      </>
      ||
      <Spinner size={36} color={colors.yellow}/>
      }
    </div>
    <div className={styles.wrapper}>
      <section className={styles.mainContent}>
        {!loading && body || <Spinner size={36} color={colors.yellow}/>}
      </section>
      <Navigation setPage={pager} navSet={navSet()} currentPage={page}/>
    </div>
  </div>)
}