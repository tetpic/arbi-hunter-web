import styles from './index.module.scss'

import { useEffect, useState } from 'react'
import Image from 'next/image'
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
import CvVcCompilation from '../CvVcCompilation'
import ArticlesList from '../ArticlesList'
import CoursesList from '../CoursesList'
import CategoryRepository from 'data/repositories/CategoryRepository'



export default function MainPageHirer() {
  const userContext = useUserContext()
  const personalContext = usePersonalContext()
  const [load, setLoad] = useState<boolean>(false)
  const [stats, setStats] = useState<IStats>()
  const [categories, setCategories] = useState<Map<number, ISpecializationCategory>>(new Map)
  const [popularCourses, setPopularCourses] = useState<Map<number, ICourse>>(new Map)
  const [news, setNews] = useState<Map<number, IArticle>>(new Map)

  const init = async() => {
    const [ stats, courses, categories, news, backs] = await Promise.all([
      UserRepository.getStats(), 
      CoursesRepository.getCourses({page: 1, limit: 10, categories: [30]},Languages.ru),
      CategoryRepository.getCategories(),
      ArticlesRepository.getNews(true),
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

        <Buildings useDefaultImage profile={userContext.currentProfile} background={personalContext.backgrounds?.get(BackgroundCategoryType.Places)}/>
        
        <div className={styles.statsWeek}>
          <div className={styles.cards}>
            <div className={styles.card}>
              <p className={styles.desc}>Отклики</p>
              <Image className={styles.icon} src={'/images/down.svg'} alt='' width={24} height={24}/>
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
            </div>
            <div className={styles.card}>
              <p className={styles.desc}>Просмотры вакансий</p>
              <Image className={styles.icon} src={'/images/down.svg'} alt='' width={24} height={24}/>
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
            </div>
            <div className={styles.card}>
              <p className={styles.desc}>Подходящие резюме</p>
              <Image className={styles.icon} src={'/images/down.svg'} alt='' width={24} height={24}/>
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
            </div>
          </div>
        </div>
      </div>

      <Title title={'Категории'} className={styles.title}/>
      <CategoriesList hideNav link={'/recruiting?category='} categories={[...categories.values()].filter(e=> e.image)}/>


      <Title title={'Подборки лучших резюме'} className={styles.title}/>
      <CvVcCompilation/>

      <Title title={'Статьи'} className={styles.title}/>
      {news.size > 0 &&
        <ArticlesList news={[...news.values()]}/>
      }

      <Title title={'Бесплатные курсы'} className={styles.title}/>
      {popularCourses.size > 0 &&
        <CoursesList courses={[...popularCourses.values()]}/>
      }
    </div>
  )
}