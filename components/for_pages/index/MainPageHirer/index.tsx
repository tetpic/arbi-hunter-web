import styles from './index.module.scss'

import { useEffect, useState } from 'react'
import { useUserContext } from 'context/user_state'
import UserRepository from 'data/repositories/UserRepository'
import { IStats } from 'data/interfaces/IUser'
import Buildings from '../../profile/Personal/Buildings'
import { usePersonalContext } from 'context/personal_state'
import { BackgroundCategoryType } from 'data/interfaces/IBackground'
import CoursesRepository from 'data/repositories/CoursesRepository'
import { Languages } from 'types/enums'
import { ISpecializationCategory } from 'data/interfaces/Common'
import ICourse from 'data/interfaces/ICourse'
import { IArticle } from 'data/interfaces/IArticle'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import Spinner from '@/components/ui/Spinner'
import Title from '@/components/ui/TitleForSection'
import CategoriesList from '@/components/ui/CategoriesList'
import ArticlesList from '../ArticlesList'
import CoursesList from '../CoursesList'
import CategoryRepository from 'data/repositories/CategoryRepository'
import EyeOpenSmallSvg from '@/components/svg/EyeOpenSmallSvg'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import { useAppContext } from 'context/state'
import { runtimeConfig } from 'config/runtimeConfig'
import { useRouter } from 'next/router'
import SwapItemsSvg from '@/components/svg/SwapItemsSvg'
import DocumentSheetSvg from '@/components/svg/DocumentSheetSvg'
import MobileBanners from '../MobileBanners'
import { useVacancyContext } from 'context/vacancy_state'



export default function MainPageHirer() {
  const {t} = useTranslation()
  const userContext = useUserContext()
  const personalContext = usePersonalContext()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const [load, setLoad] = useState<boolean>(false)
  const [stats, setStats] = useState<IStats>()
  const [categories, setCategories] = useState<Map<number, ISpecializationCategory>>(new Map)
  const [popularCourses, setPopularCourses] = useState<Map<number, ICourse>>(new Map)
  const [news, setNews] = useState<Map<number, IArticle>>(new Map)
  const router =  useRouter()
  const vacancyContext = useVacancyContext()

  const init = async() => {
    const [ stats, courses, categories, news, backs] = await Promise.all([
      UserRepository.getStats(), 
      CoursesRepository.getCourses({page: 1, limit: 10, categories: [runtimeConfig.FREE_COURSES_ID]},Languages.ru),
      CategoryRepository.getCategories(),
      ArticlesRepository.getNews({isTop: true}),
      personalContext.setPersonalPage({profileId: userContext.currentProfile?.id}) 
    ])
    setStats(stats)
    setPopularCourses(state => {
      courses.data.forEach(c => {
        state.set(c.id, c)
      })
      return state
    })
    setCategories(state=> {
      categories.forEach(el=> {
        state.set(el.id, el)
      })
      return new Map(state)
    })
    setNews(state => {
      news.data.forEach(el => {
        state.set(el.id, el)
      })
      return state
    })
    personalContext.setBackgrounds(backs)
    vacancyContext.setVacancies()

    setTimeout(()=> {
      setLoad(true)
    }, 200)
  }

  useEffect(()=>{
    init()
    document.body.style.overflowX = 'hidden'
    return ()=>{
      document.body.style.overflowX = 'hidden'
    }
  }, [])

  const onCategoryClickHandler = (c: ISpecializationCategory) => {
    CategoryRepository.getSubCategoriesByCategoryId(c.id)
    .then(res => {
      router.push({pathname: '/recruiting', query: {filters: JSON.stringify({categories:res.map(el => el.id)})}})
    })
  }

  if(!load) {
    return  (
      <div className={styles.root}>
        <Spinner size={32}/>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <div className={styles.top}>

        <Buildings 
        useDefaultImage 
        profile={userContext.currentProfile} 
        background={personalContext.backgrounds?.get(BackgroundCategoryType.Places)}
        />
        
        <div className={styles.statsWeek}>
          <div className={styles.cards}>
            <Link className={styles.card} href={'/responses'}>
              <p className={styles.desc}>{t('mainPage_hir_feedbacks')}</p>
              <SwapItemsSvg className={styles.icon}/>
              {!stats && <Spinner className={styles.count} size={22}/>
              ||
              <p className={styles.count}>
                {stats?.responsesCount.responses_count_prev_interval}
                { Number(stats?.responsesCount.responses_count_interval)>0 &&
                  <span>
                    {' + '+ stats?.responsesCount.responses_count_interval}
                  </span>
                }
              </p>
              }
            </Link>
            <Link className={styles.card} href={'/recruiting'}>
              <p className={styles.desc}>{t('mainPage_hir_cvs')}</p>
              <DocumentSheetSvg className={styles.icon}/>
              {!stats && <Spinner className={styles.count} size={22}/>
              ||
              <p className={styles.count}>
                {stats?.viewsCount.views_count_prev_interval}
                { Number(stats?.viewsCount.views_count_interval)>0 &&
                  <span>
                    {' + '+ stats?.viewsCount.views_count_interval}
                  </span>
                }
              </p>
              }
            </Link>
            <Link className={styles.card} href={'/views'}>
              <p className={styles.desc}>{t('mainPage_hir_watches')}</p>
              <EyeOpenSmallSvg className={styles.icon}/>
              {!stats && <Spinner className={styles.count} size={22}/>
              ||
              <p className={styles.count}>
                {stats?.viewsCount.views_count_prev_interval}
                { Number(stats?.viewsCount.views_count_interval)>0 &&
                  <span>
                    {' + '+ stats?.viewsCount.views_count_interval}
                  </span>
                }
              </p>
              }
            </Link>
          </div>
        </div>
      </div>


      {isTabletWidth &&
        <MobileBanners type={(vacancyContext.activeVacancies.size === 0&&vacancyContext.archiveVacancies.size === 0)?'vacancyCreate':'vipCv'}/>
      }

      <Title title={t('mainPage_hir_categories')} className={styles.title} onAllWatchClick={()=>router.push('/recruiting/categories')}/>
      <CategoriesList 
      onClick={onCategoryClickHandler} 
      watchMoreHref={'/recruiting/categories'}  
      link={'/recruiting?categories='} 
      itemClassName={styles.categoryItem}
      categories={[...categories.values()].filter(e=> e.image)}
      />

{/* 
      <Title title={t('mainPage_hir_bestCvs')} className={styles.title}/>
      <CvVcCompilation/> */}

      <Title title={t('mainPage_hir_articles')} className={styles.title}/>
      {news.size > 0 &&
        <ArticlesList onlyTitles news={[...news.values()]}/>
      }

      <Title title={t('mainPage_hir_freeCourses')} className={styles.title}/>
      {popularCourses.size > 0 &&
        <CoursesList courses={[...popularCourses.values()]}/>
      }
    </div>
  )
}