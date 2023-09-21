import { ICourseCategory } from 'data/interfaces/Common'
import { IArticle } from 'data/interfaces/IArticle'
import ICourse, { CoursesData, ICourseBlock, ICourseFeedback, ICourseStats, ICourseStep, ICourseStepAnswer } from 'data/interfaces/ICourse'
import CoursesRepository from 'data/repositories/CoursesRepository'
import { createContext, useContext, useState } from 'react'
import { useUserContext } from './user_state'

interface IState {
  courses: ICourse[]
  currentCourse: ICourse
  setCourses: (data: CoursesData) => void
  setCurrentCourse: (id: number, course?: ICourse) => Promise<boolean>

  modules: Map<ICourseBlock, ICourseStep[]>
  setCourseBlocks: (courseId: number, blocks?: ICourseBlock[]) => Promise<boolean>
  setCourseSteps: (blockId: number) => Promise<boolean>
  clearModules: ()=> void

  coursesNews: IArticle[]
  setCoursesNews: (courseId: number, page: number)=>void

  setStepAnswer: (data: ICourseStepAnswer, blockId?: number) => Promise<boolean>

  feedBacks: ICourseFeedback[]
  setFeedbacks: (courseId: number, page: number, limit: number)=>  Promise<boolean>

  categories: ICourseCategory[]
  setCoursesCategories: ()=>void

  courseStats: ICourseStats,
  getCourseFeedbackStats: (courseId: number) => void

}

const defaultValue: IState = {
  courses: [],
  currentCourse: null,
  setCourses: () => null,
  setCurrentCourse: (id: number) => null, 

  modules: new Map(),
  setCourseBlocks: (courseId: number) => null,
  setCourseSteps: (blockId: number) => null,
  clearModules: ()=> null,

  coursesNews: [],
  setCoursesNews:(courseId: number, page: number) => null,
 
  setStepAnswer: (data: ICourseStepAnswer, blockId?: number) => null,

  feedBacks: null,
  setFeedbacks: ()=>null,

  categories: null,
  setCoursesCategories: () => null,

  courseStats: null,
  getCourseFeedbackStats: (courseId: number) => null
}

const CoursesContext = createContext<IState>(defaultValue)

interface Props {
  children: React.ReactNode
}

export function CoursesWrapper(props: Props) {
  const userContext = useUserContext()
  const {profileType, countryCode} = userContext.currentProfile

  const [categories, setCategoriesState] = useState<any[]>([])
  const [courses, setCoursesState] = useState<ICourse[]>([])
  const [currentCourse, setCurrentCourseState] = useState<ICourse>()
  const [modules, setModulesState] = useState<Map<ICourseBlock, ICourseStep[]>>(new Map())
  const [feedBacks, setFeedbacksState] = useState<ICourseFeedback[]>([])
  const [coursesNews, setCoursesNewsState] = useState<IArticle[]>([])
  const [courseStats, setCoursesStats] = useState<ICourseStats>()
  

  const setCoursesCategories = () => {
    if(categories.length > 0) return
    CoursesRepository.getCoursesCategoryList(profileType)
    .then(res=>{
      setCategoriesState(res.data)
    })
  }

  const setCourses = (data: CoursesData) => {
    CoursesRepository.getCourses(data, countryCode)
    .then(res=>{
      setCoursesState(res.data)
    })
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
      const res = await CoursesRepository.getCourseModule(profileType, countryCode, blockId)
      if (res.data.length > 0) {
        setModulesState(state => {
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
    setModulesState(state=> {
      state.clear()
      return state
    })
  }

  const setCourseBlocks = async (courseId: number, blocks?: ICourseBlock[]): Promise<boolean> => {
    try {
      const res = blocks||await CoursesRepository.getCourseBlock(profileType, countryCode, courseId).then(r=> r.data)
      if (res) {
        setModulesState(state => {
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
      const res = await CoursesRepository.getFeedbacks(courseId, profileType, page, limit)
      setFeedbacksState(res.data)
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



  const value: IState = {
    ...defaultValue,
    courses,
    setCourses,
    currentCourse,
    setCurrentCourse,

    modules,
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
