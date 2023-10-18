import { ICategory } from 'data/interfaces/Common'
import { IArticle } from 'data/interfaces/IArticle'
import ICourse, { CoursesData, ICourseBlock, ICourseFeedback, ICourseStats, ICourseStep, ICourseStepAnswer } from 'data/interfaces/ICourse'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import CoursesRepository from 'data/repositories/CoursesRepository'
import { createContext, useContext, useEffect, useState } from 'react'
import { CategoryType } from 'types/enums'
import { useUserContext } from './user_state'

interface IState {
  courses: ICourse[]
  currentCourse: ICourse
  setCourses: (data: CoursesData, courses: ICourse[]) => void
  setCurrentCourse: (id: number, course?: ICourse) => Promise<boolean>

  courseModules: Map<ICourseBlock, ICourseBlock[]>
  setCourseModules: (courseId: number, modules?: ICourseBlock[])=> Promise<boolean>
  courseBlocks: Map<ICourseBlock, ICourseStep[]>
  setCourseBlocks: (courseId: number, blocks?: ICourseBlock[]) => Promise<boolean>
  setCourseSteps: (blockId: number) => Promise<boolean>
  clearModules: ()=> void

  coursesNews: IArticle[]
  setCoursesNews: (courseId: number, page: number)=>void

  setStepAnswer: (data: ICourseStepAnswer, blockId?: number) => Promise<boolean>

  feedBacks: ICourseFeedback[]
  setFeedbacks: (courseId: number, page: number, limit: number)=>  Promise<boolean>

  categories: ICategory[]
  setCoursesCategories: (categoryList?: ICategory[])=>void

  courseStats: ICourseStats,
  getCourseFeedbackStats: (courseId: number) => void

}

const defaultValue: Partial<IState> = {}

const CoursesContext = createContext<Partial<IState>>(defaultValue)

interface Props {
  children: React.ReactNode
}

export function CoursesWrapper(props: Props) {
  const userContext = useUserContext()
  const profileType = userContext?.currentProfile?.profileType
  const countryCode = userContext?.currentProfile?.countryCode

  const [categories, setCategoriesState] = useState<any[]>([])
  const [courses, setCoursesState] = useState<ICourse[]>([])
  const [currentCourse, setCurrentCourseState] = useState<ICourse>()
  const [courseModules, setCourseModulesState] = useState<Map<ICourseBlock, ICourseBlock[]>>(new Map())
  const [courseBlocks, setBlocksState] = useState<Map<ICourseBlock, ICourseStep[]>>(new Map())
  const [feedBacks, setFeedbacksState] = useState<ICourseFeedback[]>([])
  const [coursesNews, setCoursesNewsState] = useState<IArticle[]>([])
  const [courseStats, setCoursesStats] = useState<ICourseStats>()
  

  const setCoursesCategories = (categoryList?: ICategory[]) => {
    if(categoryList) {
      setCategoriesState(categoryList)
      return
    }
    if(categories.length > 0) return
    ArticlesRepository.getCategoryList({categoryType: CategoryType.Course})
    .then(res=>{
      setCategoriesState(res.data)
    })
  }

  const setCourses = (data: CoursesData|null, courses: ICourse[]) => {
    if(data === null && courses) {
      setCoursesState(courses)
    } else {
      CoursesRepository.getCourses(data, countryCode)
      .then(res=>{
        setCoursesState(res.data)
      })
    }
  }

  const setCurrentCourse = async (id: number, course?: ICourse): Promise<boolean> => {
    try {
      if(course) {
        setCurrentCourseState(course)
        return true
      } else {
        const res = await CoursesRepository.getCourseById(id)
        setCurrentCourseState(res)
        return true
      }
    } catch (err) {
      return false
    }
  }

  const setCourseSteps = async (blockId: number): Promise<boolean> => {
    try {
      const res = await CoursesRepository.getCourseSteps(profileType, countryCode, blockId)
      if (res.data.length > 0) {
        setBlocksState(state => {
          const key = [...state.keys()].find(k => k.id === blockId)
          state.set(key, res.data)
          return new Map(state)
        })
      }
      return true
    } catch (err) {
      return false
    }
  }

  const clearModules = () => {
    setBlocksState(state=> {
      state.clear()
      return state
    })
    setFeedbacksState([])
  }

  const setCourseBlocks = async (courseId: number, blocks?: ICourseBlock[]): Promise<boolean> => {
    try {
      const res = blocks||await CoursesRepository.getCourseBlock(profileType, countryCode, courseId).then(r=> r.data)
      if (res) {
        setBlocksState(state => {
          state.clear()
          res.forEach(el => {
            state.set(el, [])
          })
          return new Map(state)
        })
        Promise.all(res.map(el=> setCourseSteps(el.id)))
      }
      return true
    } catch (err) {
      return false
    }
  }

  const setFeedbacks = async (courseId: number, page: number, limit: number): Promise<boolean> => {
    try {
      const res = await CoursesRepository.getFeedbacks(courseId, page, limit)
      setFeedbacksState(res)
      return true
    } catch (err) {
      return false
    }
  }

  const setCourseModules = async (courseId: number, modules?: ICourseBlock[]):Promise<boolean>  => {
    try {
      const res = modules|| await CoursesRepository.getCourseModules(courseId, countryCode)
      setCourseModulesState(state => {
        state.clear()
        res.forEach(e => {
          state.set(e, [])
        })
        return new Map(state)
      })
      return true
    } catch (err) {
      return false
    }
  }

  const setStepAnswer = async (data: ICourseStepAnswer, blockId?: number) => {
    
    const res = await CoursesRepository.setStepAnswer(profileType, data)
    if(blockId && res) {
      setCourseSteps(blockId)
    }
    return true
  }

  const setCoursesNews = (courseId: number, page: number) => {
    const limit = 10
    CoursesRepository.getCoursesNews(profileType, countryCode, courseId, limit, page)
    .then(res=> {
      setCoursesNewsState(res)

    })
  }

  const getCourseFeedbackStats = (courseId: number) => {
    CoursesRepository.getCourseFeedbackStats(profileType, courseId)
    .then(res=>{
      setCoursesStats(res)
    })
  }

  useEffect(()=>{
    if(courseBlocks.size>0 && courseModules.size > 0) {
      
      setCourseModulesState(state=> {
        const moduleKeys = [...courseModules.keys()]
        moduleKeys.forEach(el=> {
          state.set(el, [...courseBlocks.keys()].filter(b=> b.courseModuleId === el.id))
        })
        return new Map(state)
      })
    }
  
  }, [courseBlocks])



  const value: IState = {
    ...defaultValue,
    courses,
    setCourses,
    currentCourse,
    setCurrentCourse,

    courseModules,
    setCourseModules,
    courseBlocks,
    setCourseBlocks,
    setCourseSteps,
    clearModules,

    coursesNews,
    setCoursesNews,

    setStepAnswer,

    feedBacks,
    setFeedbacks,

    setCoursesCategories,
    categories,

    courseStats,
    getCourseFeedbackStats
  }

  return (
    <CoursesContext.Provider value={value}>
      {props.children}
    </CoursesContext.Provider>
  )
}

export function useCoursesContext() {
  return useContext(CoursesContext)
}
