import styles from './index.module.scss'

import { useResize } from 'components/hooks/useResize'
import SmallStarActiveSvg from 'components/svg/SmallStarSvg'
import UserSvg from 'components/svg/UserSvg'
// import BackBtn from 'components/ui/BackBtn'
import Navigation from 'components/ui/Navigation'
import Spinner from 'components/ui/Spinner'
import { useCoursesContext } from 'context/courses_state'
import ICourse from 'data/interfaces/ICourse'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { colors } from 'styles/variables'
import { NavigationSet } from 'types/types'
import Formatter from 'utils/formatter'
import CourseFeedbacks from './CourseFeedbacks'
import CoursesInformation from './CourseInformation'
import CourseModules from './CourseModules'
import CourseNews from './CourseNews'
import RatingLine from 'components/ui/RatingLine'
import InformationSmallSvg from 'components/svg/InformationSmallSvg'
import ModulesSvg from 'components/svg/ModulesSvg'
import MessageDoubleSvg from 'components/svg/MessageDoubleSvg'
import NewsPaperSvg from 'components/svg/NewsPaperSvg'
import { useAppContext } from 'context/state'
import CoursesRepository from 'data/repositories/CoursesRepository'
import { AppTheme, Preset, SnackbarType } from 'types/enums'
import ItemNavigation from '@/components/ui/ItemNavigation'
import ImageHelper from 'utils/ImageHelper'
import useTranslation from 'next-translate/useTranslation'
import ArbiCoinGradientSvg from '@/components/svg/ArbiCoinGradientSvg'
import Button from '@/components/ui/Button'
import Spacer from '@/components/ui/Spacer'
// import ArrowRightSvg from '@/components/svg/ArrowRightSvg'
import ArrowLeftSvg from '@/components/svg/ArrowLeftSvg'
import P from '@/components/ui/P'

interface Props {
  id: number
  course: ICourse
  page?: CurrentCoursesNav
}

export enum CurrentCoursesNav {
  Information='information',
  Feedbacks='feedbacks',
  Modules='modules',
  News='news'
}

export default function CurrentCourse(props: Props) {
  const {t} = useTranslation()
  const {isTabletWidth} = useResize()
  const router = useRouter()  
  const appContext = useAppContext()
  const theme = appContext.theme
  const {currentCourse, setCurrentCourse, clearModules, courseStats, setCourseModules, setCourseBlocks, courseModules} = useCoursesContext()
  const [page, setPage] = useState<CurrentCoursesNav>(props.page||CurrentCoursesNav.Information)
  const course = props.course || currentCourse
  
  const body = useMemo(()=>{
    switch(page) {
      case CurrentCoursesNav.Information:
        return <CoursesInformation course={course} isMobile={isTabletWidth}/>
      case CurrentCoursesNav.Feedbacks:
        return <CourseFeedbacks id={props.id}/>
        case CurrentCoursesNav.Modules:
          return <CourseModules course={course} modules={[...courseModules.keys()]}/>
          case CurrentCoursesNav.News:
        return <CourseNews id={props.id}/>
      }
    }, [page])
  
  const pager = (p: CurrentCoursesNav) => {
    setPage(p)    
  }

  const saveCurrentCourse = () => {
    if(currentCourse.isSavedByCurrentProfile) {
      CoursesRepository.removeFromSaved(props.id)
      .then(_=> {
        setCurrentCourse(props.id)
        appContext.showSnackbar(t('courses_courseNoSavedYet'), SnackbarType.success)
      })
    }
    else {
      CoursesRepository.saveCourse(props.id)
      .then(_=>{
        setCurrentCourse(props.id)
        appContext.showSnackbar(t('courses_courseAddToSaved'), SnackbarType.success)
      })
    }
  }

  const availablePages = Object.values(CurrentCoursesNav)

  const navSet = useCallback(((): NavigationSet<CurrentCoursesNav>[] => {
    let result:{name: string, type: CurrentCoursesNav, icon?: JSX.Element}[]  = []
    result = Object.values(availablePages).map(page => {
      switch(page) {
        case CurrentCoursesNav.Information:
        return {name: t('courses_info'), type: page, icon: <InformationSmallSvg color={theme === AppTheme.Light && colors.black}/>}

        case CurrentCoursesNav.Modules:
        return {name: t('courses_modules'), type: page, icon: <ModulesSvg color={theme === AppTheme.Light && colors.black}/>}

        case CurrentCoursesNav.Feedbacks:
        return {name: t('courses_feedbacks'), type: page, icon: <MessageDoubleSvg color={theme === AppTheme.Light && colors.black}/>}

        case CurrentCoursesNav.News:
        return {name: t('courses_news'), type: page, icon: <NewsPaperSvg color={theme === AppTheme.Light && colors.black}/>}
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
    setCourseModules(props.id)
    setCourseBlocks(props.id)
    setCurrentCourse(props.id, props.course)
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
            <p className={styles.titleStats}><SmallStarActiveSvg/> 
              <span className={styles.yellow}>{(course.rating||0) + t('outOf') +' 5'}</span> 
              <UserSvg/> 
              {course.completedCount} 
            </p>
          }
          {!isTabletWidth && <>
            <p className={styles.description}>{course.shortDescription}</p>
            {course.price > 0 &&
              <p className={styles.price}>
                <ArbiCoinGradientSvg/>
                {Formatter.formatPrice(course.price)}
              </p>
            }
            <div className={styles.buttonsWrapper}>
              {/* <Button className={styles.buttonGradient}>{t('course_purchase')}</Button> */}
              <Button className={styles.buttonWhite} onClick={() => setPage(CurrentCoursesNav.Modules)}>{t('courses_tryForFree')}</Button>
            </div>
          </>}

          {isTabletWidth && 
            <ItemNavigation 
            pClassName={styles.mobileNavigation__p}
            bottomStringClass={styles.bottomString} 
            className={styles.mobileNavigation} 
            activeItem={page} items={navSet()} onClick={pager}/>
          }
        </div>
    
        <Image 
        unoptimized 
        className={styles.courseImage} 
        src={ImageHelper.urlFromFile(course.image, Preset.lgResize)} 
        alt={course.name} 
        fill/>
          <div className={styles.iconButtonsWrapper}>
            {/* <Button className={styles.iconButton} >
              <ShareSvg/>
            </Button> */}
            <Spacer basis={32}/>
            {!isTabletWidth &&
            <></>
            // <Button className={styles.iconButton} onClick={()=>saveCurrentCourse()}>
            //   <BookMarkSvg fill={currentCourse?.isSavedByCurrentProfile&&colors.white}/>
            // </Button>
            ||
            // <BackBtn className={styles.iconButton} onClick={()=>{router.back()}} />
            <Button styleType={['black', 'icon', 'svg24']} altStyleType={['whitePurple', 'icon', 'svg24', 'invertSvg']} onClick={()=>{router.back()}}>
              <ArrowLeftSvg/>
            </Button>
            }
          </div>
      </>
      ||
      <Spinner size={36} color={colors.blue}/>
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
              <P useThemeColor styleType={['fs36', 'w700']}>{courseStats.raiting.raiting}</P>
              <RatingLine rating={courseStats.raiting.raiting}/>
              <P styleType={['greyLight', 'medium','w500']} >{courseStats.count} {Formatter.pluralize(courseStats.count, t('feedback1'), t('feedback2'), t('feedback3'))}</P>
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

    {isTabletWidth && page === CurrentCoursesNav.Information &&
      <div className={styles.buttonsWrapper}>
        {/* <Button className={styles.buttonGradient}>{t('course_purchase')}</Button> */}
        <Button className={styles.buttonWhite} onClick={() => setPage(CurrentCoursesNav.Modules)}>{t('courses_tryForFree')}</Button>
      </div>
    }
  </div>)
}