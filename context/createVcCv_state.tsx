import { ISource } from 'data/interfaces/Common'
import { ICVCreate, ICategory, ICV } from 'data/interfaces/ICV'
import { ILanguageKnowledge } from 'data/interfaces/IJob'
import { IVacancy, IVacancyCreate } from 'data/interfaces/IVacancy'
import CvRepository from 'data/repositories/CvRepository'
import router from 'next/router'
import { createContext, useContext, useState } from 'react'

interface ILangHelper extends ILanguageKnowledge {
  ru?: string
}

interface HelpObject {
  skills?: ISource[],
  languageKnowledges?: ILangHelper[],
  sources?: ISource[]
  activeSources?: Set<ISource>
  cityId?: number
  countryId?: number,
  categoryIds?: ICategory[]
}

const initialHelpObject: HelpObject = {
  activeSources: new Set(), 
  skills: [], 
  languageKnowledges: [], 
  sources: [],
  cityId: null,
  countryId: null,
  categoryIds: []
}

interface IState {
  currentCv: ICVCreate,
  setCurrentCv: (v: ICVCreate) => void

  currentVc: IVacancyCreate,
  setCurrentVc: (v: IVacancyCreate) => void

  helpObjects: HelpObject
  setHelpObjects: (o: HelpObject)=> void

  progress: number
  setProgress: (p: number) => void

  categories:  Map<ICategory, ICategory[]|null>
  setCategories: ()=> void
  setSubCategories: (v: ICategory)=>void
  reset: ()=>void

  setEditedItem: (item: ICV|IVacancy, type: 'cv'|'vc') => void
}

const defaultValue: IState = {
  currentCv: null,
  setCurrentCv: () => null,

  currentVc: null,
  setCurrentVc: (v: IVacancyCreate) => null,

  helpObjects: initialHelpObject,
  setHelpObjects: ()=>null,

  progress: 1,
  setProgress: (p) => null,

  categories: new Map(),
  setCategories: () => null,
  setSubCategories: () => null,
  reset: ()=>null,

  setEditedItem: () => null
}

const CreateVcCvContext = createContext<IState>(defaultValue)

interface Props {
  children: React.ReactNode
}

export function CreateVcCvWrapper(props: Props) {
  const [currentCv, setCv] = useState<ICVCreate>()
  const [currentVc, setVc] = useState<IVacancyCreate>()
  const [progress, handleProgress] = useState<number>(1)
  const [helpObjects, setHelp] = useState<HelpObject>(initialHelpObject)
  const [categories, setCategoriesState] = useState<Map<ICategory, ICategory[]|null>>(new Map())

  const setCurrentCv = (v: ICVCreate) => {
    setCv(state=> {return {...state, ...v}})
  }

  const setCurrentVc = (v: IVacancyCreate) => {
    setVc(state=> {return {...state, ...v}})
  }

  const setProgress = (p: number) => {
    handleProgress(p)
  }

  const setHelpObjects = (o: HelpObject) => {
    setHelp(state=> {return {...state, ...o}})
  }

  const setCategories =() => {
    if(categories?.size < 1) {
      CvRepository.getCategories()
      .then(res => {
        setCategoriesState(()=> {
          let map = new Map()
          res.forEach(el=> {
            map.set(el, null)
          })
          return map
        })
      })
    }
  }

  const setSubCategories = (s: ICategory) => {
    if(!categories.get(s)) {
      CvRepository.getSubCategories(s.id)
      .then(res => {
        setCategoriesState(state => {
          state.set(s, res)
          return new Map(state)
        })
      })
    }
  }

  const setEditedItem = async(item: ICV|IVacancy, type: 'cv'|'vc') => {
    setHelp(state=>{return {...state, categoryIds: item.categories, }})

    

    if(type === 'vc') {
      setVc(state=> {return {...state, ...item,
        categoriesIds: item.categories.map(el=> el.id)
      }})
      router.push(`/create/vacancy?id=${item.id}`)
    } 
    else if(type === 'cv') {
      setCv(state=> {return {...state, ...item,
        categoriesIds: item.categories.map(el=> el.id)
      }})
      router.push(`/create/cv?id=${item.id}`)
    }

  }



  const reset = () => {
    handleProgress(1)
    setHelp(initialHelpObject)
    setCv(null)
    setVc(null)
  }
  

  const value: IState = {
    ...defaultValue,
    currentCv,
    setCurrentCv,

    currentVc,
    setCurrentVc,
    
    helpObjects,
    setHelpObjects,

    progress,
    setProgress,

    categories,
    setCategories,
    setSubCategories,
    reset,

    setEditedItem
  }

  return (
    <CreateVcCvContext.Provider value={value}>
      {props.children}
    </CreateVcCvContext.Provider>
  )
}

export function useCreateVcCvContext() {
  return useContext(CreateVcCvContext)
}
