import styles from './index.module.scss'

import { useCharacterContext } from 'context/character_state'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useCvContext } from 'context/cv_state'
import Spinner from 'components/ui/Spinner'
import { useUserContext } from 'context/user_state'
import { IStats } from 'data/interfaces/IUser'
import UserRepository from 'data/repositories/UserRepository'
import { ModelActions } from 'components/for_pages/profile/userProfile/UserEditor'
import PersonalHeader from '../../personal/PersonalHeader'
import { usePersonalContext } from 'context/personal_state'
import Title from '@/components/ui/TitleForSection'
import CategoriesList from '@/components/ui/CategoriesList'
import {  ISpecializationCategory } from 'data/interfaces/Common'
import CvRepository from 'data/repositories/CvRepository'
import CoursesRepository from 'data/repositories/CoursesRepository'
import {  Languages } from 'types/enums'
import ICourse from 'data/interfaces/ICourse'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import { IArticle } from 'data/interfaces/IArticle'
import CvVcCompilation from '../CvVcCompilation'
import ArticlesList from '../ArticlesList'
import CoursesList from '../CoursesList'

export default function MainPageEmployee() {

  const personalContext = usePersonalContext()
  const characterContext = useCharacterContext()
  const userContext  = useUserContext()
  const cvContext = useCvContext()
  const [load, setLoad] = useState<boolean>(false)
  const [stats, setStats] = useState<IStats>(null)
  const [action, setAction] = useState<ModelActions>(ModelActions.LongAnimation)
  const [categories, setCategories] = useState<Map<number, ISpecializationCategory>>(new Map)
  const [popularCourses, setPopularCourses] = useState<Map<number, ICourse>>(new Map)
  const [news, setNews] = useState<Map<number, IArticle>>(new Map)


  const actionsAllowedMap: {type: ModelActions, duration: number}[] = characterContext.variant.model === 'man'?
  [
    {type: ModelActions.Appearance, duration: ~~(characterContext.durations[ModelActions.Appearance]*1000)},
    {type: ModelActions.Laughter, duration: ~~(characterContext.durations[ModelActions.Laughter]*1000)},
    {type: ModelActions.New, duration: ~~(characterContext.durations[ModelActions.New]*1000)},
    {type: ModelActions.No, duration: ~~(characterContext.durations[ModelActions.No]*1000)},
    {type: ModelActions.ShakesHead, duration: ~~(characterContext.durations[ModelActions.ShakesHead]*1000)},
    {type: ModelActions.Shrug, duration: ~~(characterContext.durations[ModelActions.Shrug]*1000)},
    {type: ModelActions.TurnsAway, duration: ~~(characterContext.durations[ModelActions.TurnsAway]*1000)},
    {type: ModelActions.Yes, duration: ~~(characterContext.durations[ModelActions.Yes]*1000)},
  ]:
  [
    {type: ModelActions.TurnsAway, duration: ~~(characterContext.durations[ModelActions.TurnsAway]*1000)},
    {type: ModelActions.Appearance, duration: ~~(characterContext.durations[ModelActions.Appearance]*1000)},
    {type: ModelActions.Laughter, duration: ~~(characterContext.durations[ModelActions.Laughter]*1000)},
    {type: ModelActions.Sadness, duration: ~~(characterContext.durations[ModelActions.Sadness]*1000)},
    {type: ModelActions.Shrug, duration: ~~(characterContext.durations[ModelActions.Shrug]*1000)},
    {type: ModelActions.Action_test, duration: ~~(characterContext.durations[ModelActions.Action_test]*1000)},
    {type: ModelActions.No, duration: ~~(characterContext.durations[ModelActions.No]*1000)},
    {type: ModelActions.ShakesHead, duration: ~~(characterContext.durations[ModelActions.ShakesHead]*1000)},
    {type: ModelActions.Yes, duration: ~~(characterContext.durations[ModelActions.Yes]*1000)},

  ]

  const [temporaryAnimation, setTemporaryAnimation] = useState<{type: ModelActions, duration: number}>(actionsAllowedMap[0])
  const [disableClick, setDisableClick] = useState<boolean>(false)


  const showNextAnimation = () => {
    setDisableClick(true)
    setAction(temporaryAnimation.type)
    setTimeout(()=> {
      setAction(ModelActions.LongAnimation)
      setTemporaryAnimation((actionsAllowedMap[actionsAllowedMap.map(el=> el.type).indexOf(temporaryAnimation.type)+1]||actionsAllowedMap[0]))
      setDisableClick(false)      
    }, temporaryAnimation.duration)
  }

  const init = async() => {
    const [stats, categories, courses, news, backs] = await Promise.all([
      UserRepository.getStats(),
      CvRepository.getCategories(),
      CoursesRepository.getCourses({page: 1, limit: 20, categories: [30]},Languages.ru),
      ArticlesRepository.getNews(true, {page: 1, limit: 20, isTop: false}),
      personalContext.setPersonalPage({profileId: userContext.currentProfile?.id})
    ])
    setStats(stats)
    setCategories(state=> {
      categories.forEach(el=> {
        state.set(el.id, el)
      })
      return new Map(state)
    })
    setPopularCourses(state => {
      courses.data.forEach(c => {
        state.set(c.id, c)
      })
      return state
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
    }, 100)
  }



  useEffect(()=>{
    characterContext.init()
    cvContext.setSavedCvs()
    init()
  }, [])

  useEffect(()=>{
    setTemporaryAnimation(actionsAllowedMap[0])
  }, [characterContext.durations])

  if(!load) {
    return(
      <div className={styles.root}>
        <Spinner size={32}/>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <div className={styles.top}>
        {/* {personalContext.personalPage && personalContext.backgrounds && */}
          <PersonalHeader action={action} showNextAnimation={showNextAnimation} useModel/>
        {/* } */}
        <div className={styles.statsWeek}>
          <div className={styles.cards}>
            <div className={styles.card}>
              <p className={styles.desc}>Отклики и приглашения</p>
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
              <p className={styles.desc}>Просмотры резюме</p>
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
              <p className={styles.desc}>Вакансии</p>
              <Image className={styles.icon} src={'/images/down.svg'} alt='' width={24} height={24}/>
              {!stats && <Spinner className={styles.count} size={22}/>
              ||
              <p className={styles.count}>
                {stats?.newVacanciesCount.new_vacancies_count_prev_interval}
                { Number(stats?.newVacanciesCount.new_vacancies_count_interval)>0 &&
                  <span>
                    {' + '+ stats?.newVacanciesCount.new_vacancies_count_interval}
                  </span>
                }
              </p>
              }
            </div>
          </div>
        </div>
      </div>

      <Title title={'Категории'} className={styles.title}/>
      <CategoriesList hideNav categories={[...categories.values()].filter(e=> e.image)}/>

      <Title title={'Подборки лучших вакансий'} className={styles.title}/>
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