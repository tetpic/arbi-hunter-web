import { ICategory } from 'data/interfaces/Common'
import { IArticle } from 'data/interfaces/IArticle'
import ICourse, { CoursesData, ICourseBlock, ICourseFeedback, ICourseStats, ICourseStep, ICourseStepAnswer } from 'data/interfaces/ICourse'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import CoursesRepository from 'data/repositories/CoursesRepository'
import { Dispatch, MutableRefObject, SetStateAction, createContext, useContext, useEffect, useRef, useState } from 'react'
import { CategoryType } from 'types/enums'
import { useUserContext } from './user_state'

interface IState {
  courses: Map<number, ICourse>
  startedCourses: Map<number, ICourse>
  coursesTotal: number
  startedCoursesTotal: number
  currentCourse: ICourse
  setCourses: (data: CoursesData, courses?: ICourse[]) => void
  setCurrentCourse: (id: number, course?: ICourse) => Promise<boolean>

  courseModules: Map<ICourseBlock, ICourseBlock[]>
  setCourseModules: (courseId: number, modules?: ICourseBlock[])=> Promise<boolean>
  courseBlocks: Map<ICourseBlock, ICourseStep[]>
  setCourseBlocks: (courseId: number, blocks?: ICourseBlock[]) => Promise<boolean>
  setCourseSteps: (blockId: number) => Promise<boolean>
  clearModules: ()=> void
  activeBlock: ICourseBlock
  setActiveBlock: Dispatch<SetStateAction<ICourseBlock>>
  activeStep: ICourseStep
  setActiveStep: Dispatch<SetStateAction<ICourseStep>>
  allStepsRef: MutableRefObject<ICourseStep[]>
  allBlocksRef: MutableRefObject<ICourseBlock[]>
  allModulesRef: MutableRefObject<ICourseBlock[]>

  courseInit: () => Promise<boolean>
  loading: boolean

  coursesNews: IArticle[]
  setCoursesNews: (courseId: number, page: number)=>void

  setStepAnswer: (data: ICourseStepAnswer, blockId?: number) => Promise<boolean>

  feedBacks: ICourseFeedback[]
  setFeedbacks: (courseId: number, page: number, limit: number)=>  Promise<boolean>

  categories: ICategory[]
  setCoursesCategories: (categoryList?: ICategory[])=>Promise<boolean>

  courseStats: ICourseStats,
  getCourseFeedbackStats: (courseId: number) => void
}


const CoursesContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
  course?: ICourse,
  id?: number, 
  block?: number
  module?: number
  step?: number
}

export function CoursesWrapper(props: Props) {
  const userContext = useUserContext()
  const profileType = userContext?.currentProfile?.profileType
  const countryCode = userContext?.currentProfile?.countryCode

  const [categories, setCategoriesState] = useState<any[]>([])
  const [courses, setCoursesState] = useState<Map<number, ICourse>>(new Map)
  const [coursesTotal, setCoursesTotal] = useState<number>(0)
  const [startedCourses, setStartedCourse] = useState<Map<number, ICourse>>(new Map)
  const [startedCoursesTotal, setStartedCourseTotal] = useState<number>(0)
  const [currentCourse, setCurrentCourseState] = useState<ICourse>()
  const [courseModules, setCourseModulesState] = useState<Map<ICourseBlock, ICourseBlock[]>>(new Map())
  const [courseBlocks, setBlocksState] = useState<Map<ICourseBlock, ICourseStep[]>>(new Map())
  const [feedBacks, setFeedbacksState] = useState<ICourseFeedback[]>([])
  const [coursesNews, setCoursesNewsState] = useState<IArticle[]>([])
  const [courseStats, setCoursesStats] = useState<ICourseStats>()
  const [activeBlock, setActiveBlock] = useState<ICourseBlock>()
  const [activeStep, setActiveStep] = useState<ICourseStep>()
  const [loading, setLoading] = useState<boolean>(true)

  const allStepsRef = useRef<ICourseStep[]>([])
  const allBlocksRef = useRef<ICourseBlock[]>([])
  const allModulesRef = useRef<ICourseBlock[]>([])

  const setCoursesCategories = async (categoryList?: ICategory[]): Promise<boolean> => {
    if(categoryList) {
      setCategoriesState(categoryList)
      return 
    }
    if(categories.length > 0) return
    const res = await ArticlesRepository.getCategoryList({ categoryType: CategoryType.Course })
    setCategoriesState(res.data)
    return true
  }

  const setCourses = (data: CoursesData|null, courses?: ICourse[]) => {
    const setState = (c: ICourse[], started?: boolean) => {
      started?
      setStartedCourse(state=> {
        c.forEach(course => {
          state.set(course.id, course)
        })
        return new Map(state)
      })
      :
      setCoursesState(state=> {
        c.forEach(course => {
          state.set(course.id, course)
        })
        return new Map(state)
      })
    }

    if(data === null && courses) {
      setState(courses)
      setCoursesTotal(courses.length)
    } else {
      CoursesRepository.getCourses(data, countryCode)
      .then(res=>{
        setState(res.data, data.started)
        data.started?setStartedCourseTotal(res.total):setCoursesTotal(res.total)
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
      const res = await CoursesRepository.getCourseSteps(countryCode, blockId)
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

  const setCourseBlocks = async (courseId: number, blocks?: ICourseBlock[]): Promise<boolean> => {
    try {
      const res = blocks||await CoursesRepository.getCourseBlock(countryCode, courseId).then(r=> r.data)
      if (res) {
        setBlocksState(state => {
          state.clear()
          res.forEach(el => {
            state.set(el, [])
          })
          return new Map(state)
        })
        await Promise.all(res.map(el=> setCourseSteps(el.id)))
        return true
      }
    } catch (err) {
      return false
    }
  }

  const setCourseModules = async (courseId: number, modules?: ICourseBlock[]):Promise<boolean>  => {
    try {
      const res = modules|| await CoursesRepository.getCourseModules(countryCode, courseId)
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

  const courseInit = async():Promise<boolean> => {
    if(!props.course || !props.block || !props.module || !props.step) {
      return  false
    }
    setCurrentCourseState(props.course)
    const modules = await CoursesRepository.getCourseModules(countryCode, props.course.id)
    const blocks = await CoursesRepository.getCourseBlock(countryCode, props.course.id).then(r=> r.data)
    const steps = await Promise.all(blocks.map(block=> CoursesRepository.getCourseSteps(countryCode, block.id).then(d=> d.data)))
    let allSteps: ICourseStep[] = []
    steps.forEach(el=> allSteps.push(...el))
    
    allBlocksRef.current = blocks
    allModulesRef.current = modules

    setCourseModulesState(state => {
      state.clear()
      modules.forEach(e => {
        state.set(e, blocks.filter(el=> el.courseModuleId === e.id))
      })
      return new Map(state)
    })

    setBlocksState(state => {
      state.clear()
      blocks.forEach(block => {
        state.set(block, allSteps.filter(step=> step.courseBlockId === block.id))
      })
      return new Map(state)
    })

    /* set initial Block */
    const initialBlockIndex = blocks.findIndex(f=> f.courseModuleId === modules[Number(props.module)-1].id)
    const activeBlock = blocks[initialBlockIndex+(Number(props.block)-1)]||blocks[0]
    setActiveBlock(activeBlock)

    /* set initial step */
    const initialStep = allSteps.filter(step=> step.courseBlockId === activeBlock.id)[0]
    setActiveStep(initialStep)


    setLoading(false)
    return true
  }

  const clearModules = () => {
    setBlocksState(state=> {
      state.clear()
      return state
    })
    setFeedbacksState([])
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

  const setStepAnswer = async (data: ICourseStepAnswer, blockId?: number) => {
    
    const res = await CoursesRepository.setStepAnswer(data)
    if(blockId && res) {
      setCourseSteps(blockId)
    }
    return true
  }

  const setCoursesNews = (courseId: number, page: number) => {
    const limit = 10
    CoursesRepository.getCoursesNews({courseId, limit, page, lang: countryCode, full: true})
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
    const allSteps:ICourseStep[] = []
    for(let block of courseBlocks.values()){allSteps.push(...block)}
    allStepsRef.current = allSteps

    if(courseBlocks.size>0 && courseModules.size > 0) {
      setCourseModulesState(state=> {
        for(let m of courseModules.keys()) {
          const blocksKeys:ICourseBlock[] = []
          courseBlocks.forEach((v, k)=> k.courseModuleId === m.id&&blocksKeys.push(k))
          state.set(m, blocksKeys)
        }
        return new Map(state)
      })
    }
  }, [courseBlocks])



  const value: IState = {
    courses,
    coursesTotal,
    startedCourses,
    startedCoursesTotal,
    setCourses,
    currentCourse,
    setCurrentCourse,

    courseModules,
    setCourseModules,
    courseBlocks,
    setCourseBlocks,
    setCourseSteps,
    clearModules,
    activeBlock,
    activeStep,
    setActiveBlock,
    setActiveStep,
    allStepsRef,
    allBlocksRef,
    allModulesRef,

    coursesNews,
    setCoursesNews,

    setStepAnswer,
    loading,

    feedBacks,
    setFeedbacks,

    setCoursesCategories,
    categories,
    courseInit,

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
