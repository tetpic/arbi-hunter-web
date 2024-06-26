import { runtimeConfig } from 'config/runtimeConfig'
import { ISpecializationCategory } from 'data/interfaces/Common'
import { IArticle } from 'data/interfaces/IArticle'
import ICourse from 'data/interfaces/ICourse'
import { IStats } from 'data/interfaces/IUser'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import CategoryRepository from 'data/repositories/CategoryRepository'
import CoursesRepository from 'data/repositories/CoursesRepository'
import UserRepository from 'data/repositories/UserRepository'
import { createContext, useContext,  useEffect,  useState } from 'react'
import { Languages } from 'types/enums'
import { useUserContext } from './user_state'
import { IVacancy } from 'data/interfaces/IVacancy'

interface IState {
  stats: IStats
  categories: Map<number, ISpecializationCategory>
  popularCourses: Map<number, ICourse>
  news: Map<number, IArticle>
  loaded: boolean
  archiveVacancies: Map<number, IVacancy>
  activeVacancies: Map<number, IVacancy>
  init: () => void
  setVacancies: (activeVacancies: Map<number, IVacancy>, archiveVacancies: Map<number, IVacancy>) => void
  clearStats: () => void
}



const IndexPageContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
}

export function IndexPageWrapper(props: Props) {
  const [stats, setStats] = useState<IStats>()
  const [categories, setCategories] = useState<Map<number, ISpecializationCategory>>(new Map)
  const [popularCourses, setPopularCourses] = useState<Map<number, ICourse>>(new Map)
  const [news, setNews] = useState<Map<number, IArticle>>(new Map)
  const [loaded, setLoaded] = useState<boolean>(false)
  const userContext = useUserContext()
  const [archiveVacancies, setArchiveVacanciesState] = useState<Map<number, IVacancy>>(new Map())
  const [activeVacancies, setActiveVacanciesState] = useState<Map<number, IVacancy>>(new Map())


  const init = async() => {
    const [ _stats, _courses, _categories, _news] = await Promise.all([
      UserRepository.getStats(), 
      CoursesRepository.getCourses({page: 1, limit: 10, categories: [runtimeConfig.FREE_COURSES_ID]},Languages.ru),
      CategoryRepository.getCategories(),
      ArticlesRepository.getNews({isTop: true}),
    ])
    setStats(_stats)
    setPopularCourses(state => {
      _courses.data.forEach(c => {
        state.set(c.id, c)
      })
      return state
    })
    setCategories(state=> {
      _categories.forEach(el=> {
        state.set(el.id, el)
      })
      return new Map(state)
    })
    setNews(state => {
      _news.data.forEach(el => {
        state.set(el.id, el)
      })
      return state
    })
    setTimeout(() => {
      setLoaded(true)
    }, 20)
  }

  const setVacancies = (activeVacancies: Map<number, IVacancy>, archiveVacancies: Map<number, IVacancy>) => {
    setActiveVacanciesState(activeVacancies)
    setArchiveVacanciesState(archiveVacancies)
  }

  const clearStats = () => {
    setStats(undefined)
  }

  useEffect(()=>{
    if(!userContext.currentProfile) {
      clearStats()
    }
    else {
      UserRepository.getStats()
      .then(res => {
        setStats(res)
      })
    }
  }, [userContext.currentProfile])


  const value: IState = {
    stats,
    categories,
    popularCourses,
    news,
    init,
    loaded,
    clearStats,
    activeVacancies,
    archiveVacancies,
    setVacancies
  }

  return (
    <IndexPageContext.Provider value={value}>
      {props.children}
    </IndexPageContext.Provider>
  )
}

export function useIndexPageContext() {
  return useContext(IndexPageContext)
}
