import styles from './index.module.scss'

import { useResize } from 'components/hooks/useResize'
import AppsAddSvg from 'components/svg/AppsAddSvg'
import DocumentDoubleSvg from 'components/svg/DocumentDoubleSvg'
import SubCategories from 'components/ui/SubNavigationSet'
import TitleForSection from 'components/ui/TitleForSection'
import { ICategory } from 'data/interfaces/Common'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import SearchBar from 'components/ui/SearchBar'
import Navigation from 'components/ui/Navigation'
import { useCoursesContext } from 'context/courses_state'
import AllCourses from './AllCourses'
import CoursesByCategory from './CoursesByCategory'
import Spinner from 'components/ui/Spinner'
import { useUserContext } from 'context/user_state'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  category?: number
  page?: CompilationsNav
  isMobile?: boolean
}

export enum CompilationsNav {
  All='all',
  Started='started',
  Categories='categories'
}

export default function CoursesCompilations(props: Props) {
  const {t} = useTranslation()
  const coursesContext = useCoursesContext()
  const userContext = useUserContext()
  const {isTabletWidth, width} = useResize()

  const [page, pager] = useState<CompilationsNav>(props.page)
  const router = useRouter()

  const [currentCategory, setCurrentCategory] = useState<ICategory>()
  const subCategories = <SubCategories categories={coursesContext.categories} currentCategory={currentCategory} setCurrent={(e: ICategory) => setCurrentCategory(e)} />

  const navSet = (()=>{
    const obj = userContext.currentProfile?Object.values(CompilationsNav):[CompilationsNav.All, CompilationsNav.Categories]
    let result = obj.map(page => {
      switch(page) {
        case CompilationsNav.All:
          return {name: t('courses_allCourses'), type: page, icon: <DocumentDoubleSvg/>}
        case CompilationsNav.Categories:
          return {name: t('courses_categories'), type: page, subSet: subCategories, icon: <AppsAddSvg/>}
        case CompilationsNav.Started:
          return {name: t('courses_started'), type: page, icon: <AppsAddSvg/>}
      }
    })
    result = isTabletWidth?result.filter(el=> el.type !== CompilationsNav.Categories):result
    return result
  })()

  const body = (<>
  {
    page === CompilationsNav.All&&<AllCourses key={'all'}/>
    ||
    page === CompilationsNav.Categories && (currentCategory &&<CoursesByCategory categoryId={currentCategory.id}/>||<Spinner size={34}/>)
    ||
    page === CompilationsNav.Started &&<AllCourses key={'started'} started={true}/>
  }
  </>)

  const title = (()=> {
    switch(page) {
      case CompilationsNav.All:
        return t('courses_allCourses')
      case CompilationsNav.Started:
        return t('courses_started')
      case CompilationsNav.Categories:
        return currentCategory?.name||t('courses_categories')
    }
  })()

  const openCategoriesList = () => {
    
  }

  useEffect(()=>{
    if(width) {
      router.replace({query: { ...router.query, page: page, category: currentCategory?.id}}, undefined, {shallow: true})
    }
  }, [page, currentCategory, width])

  useEffect(()=>{
    setCurrentCategory([...coursesContext.categories.values()].find(el=> el.id === +router.query.category))
  }, [router])

  useEffect(()=>{
    if(coursesContext.categories) {
      setCurrentCategory(coursesContext.categories.find(el=> el.id === +props.category)||coursesContext.categories[0])
    }
  }, [coursesContext.categories])


  useEffect(()=>{
    coursesContext.setCoursesCategories()
    .then(_=>{
    })
  }, [])

  return (<div className={styles.root} > 
    <div className={styles.contentWrapper}>
      <div className='container'>
        <TitleForSection title={title} onBackClick={()=>isTabletWidth&&router.back()}/>
        {/* {isTabletWidth && 
          <ItemNavigation bottomStringClass={styles.bottomString} className={styles.itemNav} activeItem={page} items={navSet} onClick={(p)=> {pager(p)}}/>
        } */}
      </div>
      <div className={styles.bodyWrapper} id={'scrollable'}>
        <SearchBar className={styles.searchBar} onFilterClick={() => openCategoriesList()}/>
        {body}
      </div>
    </div>
    {!isTabletWidth && 
      <Navigation wrapperClassName={styles.nav} setPage={(p)=> pager(p)} currentPage={page} navSet={navSet}/>
    }
  </div>)

}