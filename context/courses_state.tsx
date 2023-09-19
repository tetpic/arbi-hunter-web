import { ICourseCategory } from 'data/interfaces/Common'
import ICourse, { CoursesData } from 'data/interfaces/ICourse'
import CoursesRepository from 'data/repositories/CoursesRepository'
import { createContext, useContext, useState } from 'react'
import { useUserContext } from './user_state'

interface IState {
  courses: ICourse[]
  currentCourse: ICourse
  setCourses: (data: CoursesData) => void
  setCurrentCourse: (id: number) => Promise<boolean>

  categories: ICourseCategory[]
  setCoursesCategories: ()=>void

}

const defaultValue: IState = {
  courses: [],
  currentCourse: null,
  setCourses: () => null,
  setCurrentCourse: (id: number) => null, 

  categories: null,
  setCoursesCategories: () => null,
}

const CoursesContext = createContext<IState>(defaultValue)

interface Props {
  children: React.ReactNode
}

export function CoursesWrapper(props: Props) {
  const userContext = useUserContext()

  const [categories, setCategoriesState] = useState<any[]>([])
  const [courses, setCoursesState] = useState<ICourse[]>([])
  const [currentCourse, setCurrentCourseState] = useState<ICourse>()

  const setCoursesCategories = () => {
    if(categories.length > 0) return
    CoursesRepository.getCoursesCategoryList(userContext.currentProfile.profileType)
    .then(res=>{
      setCategoriesState(res.data)
    })
  }

  const setCourses = (data: CoursesData) => {
    CoursesRepository.getCourses(data, userContext.currentProfile.countryCode)
    .then(res=>{
      setCoursesState(res.data)
    })
  }

  const setCurrentCourse = async (id: number): Promise<boolean> => {
    try {
      const res = await CoursesRepository.getCourseById(id)
      setCurrentCourseState(res)
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
