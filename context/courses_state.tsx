import { ICourseCategory } from 'data/interfaces/Common'
import ICourse, { CoursesData, ICourseBlock, ICourseFeedback, ICourseStep } from 'data/interfaces/ICourse'
import CoursesRepository from 'data/repositories/CoursesRepository'
import { createContext, useContext, useState } from 'react'
import { useUserContext } from './user_state'

interface IState {
  courses: ICourse[]
  currentCourse: ICourse
  setCourses: (data: CoursesData) => void
  setCurrentCourse: (id: number, course?: ICourse) => Promise<boolean>

  modules: Map<ICourseBlock, ICourseStep[]>
  setCourseBlocks: (courseId: number) => Promise<boolean>
  setCourseSteps: (blockId: number) => Promise<boolean>
  clearModules: ()=> void

  feedBacks: ICourseFeedback[]
  setFeedbacks: (courseId: number, page: number, limit: number)=>  Promise<boolean>

  categories: ICourseCategory[]
  setCoursesCategories: ()=>void

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

  feedBacks: null,
  setFeedbacks: ()=>null,

  categories: null,
  setCoursesCategories: () => null,
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

  const setCourseBlocks = async (courseId: number): Promise<boolean> => {
    try {
      const res = await CoursesRepository.getCourseBlock(profileType, countryCode, courseId)
      if (res.data) {
        setModulesState(state => {
          state.clear()
          res.data.forEach(el => {
            state.set(el, [])
          })
          return new Map(state)
        })
        Promise.all(res.data.map(el=> setCourseSteps(el.id)))
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

    feedBacks,
    setFeedbacks,

    setCoursesCategories,
    categories
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
