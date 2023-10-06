import { ISpecializationCategory, ISource } from 'data/interfaces/Common'
import { ICVCreate, ICV } from 'data/interfaces/ICV'
import { ILanguageKnowledge } from 'data/interfaces/IJob'
import { IVacancy, IVacancyCreate } from 'data/interfaces/IVacancy'
import CvRepository from 'data/repositories/CvRepository'
import VacancyRepository from 'data/repositories/VacancyRepository'
import { createContext, useContext, useState } from 'react'
import { useUserContext } from './user_state'


interface HelpObject {
  skills?: ISource[],
  languageKnowledges?: ILanguageKnowledge[],
  sources?: ISource[]
  activeSources?: Map<number, ISource>
  cityId?: number
  countryId?: number,
  categoryIds?: ISpecializationCategory[]
}

const initialHelpObject: HelpObject = {
  activeSources: new Map(), 
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
  getCurrentCv: (id: number) => void

  currentVc: IVacancy,
  setCurrentVc: (v: IVacancy) => void
  getCurrentVc: (id: number) => void

  helpObjects: HelpObject
  setHelpObjects: (o: HelpObject)=> void

  progress: number
  setProgress: (p: number) => void

  categories:  Map<ISpecializationCategory, ISpecializationCategory[]|null>
  setCategories: ()=> void
  setSubCategories: (v: ISpecializationCategory)=>void
  reset: ()=>void

  setEditedItem: (item: ICV|IVacancy, type: 'cv'|'vc') => void
}

const defaultValue: IState = {
  currentCv: null,
  setCurrentCv: () => null,
  getCurrentCv: (id: number) => null,

  currentVc: null,
  setCurrentVc: (v: IVacancyCreate) => null,
  getCurrentVc: (id: number) => null,

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
  const userContext = useUserContext()

  const [currentCv, setCv] = useState<ICVCreate>()
  const [currentVc, setVc] = useState<IVacancy>()
  const [progress, handleProgress] = useState<number>(1)
  const [helpObjects, setHelp] = useState<HelpObject>(initialHelpObject)
  const [categories, setCategoriesState] = useState<Map<ISpecializationCategory, ISpecializationCategory[]|null>>(new Map())

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
    debugger
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

  const setSubCategories = (s: ISpecializationCategory) => {
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

  const setEditedItem = async<T extends ICV|IVacancy>(item: T, type: 'cv'|'vc') => {
    if(type === 'vc') {
      const vcItem = item as IVacancy
      setHelp(state=>{return {...state, 
        categoryIds: vcItem.categories,   
        cityId: vcItem.cityId,
        countryId: vcItem.countryId,
        skills: vcItem.skills,
        languageKnowledges: vcItem.languageKnowledges,
        activeSources: new Map(vcItem?.sources&&vcItem?.sources?.map(el=> [el.id, el]))
      }})
      setVc(state=> {return {...state, ...item,
        categoriesIds: item.categories.map(el=> el.id),
      }})
    } 
    else if(type === 'cv') {
      const cvItem = item as ICV
      setHelp(state=>{return {...state, 
        categoryIds: cvItem.categories,   
        cityId: cvItem.cityId,
        countryId: cvItem.countryId,
        skills: cvItem.skills,
        languageKnowledges: cvItem.languageKnowledges,
        activeSources: new Map(cvItem?.sources&&cvItem?.sources?.map(el=> [el.id, el]))
      }})
      setCv(state=> {return {...state, ...item,
        categoriesIds: item.categories.map(el=> el.id)
      }})
    }
  }

  const getCurrentVc = (id: number) => {
    VacancyRepository.getVacancyById(id, userContext.currentProfile?.profileType)
    .then(res=> {
      setEditedItem(res, 'vc')
    })
  }

  const getCurrentCv = (id: number) => {
    CvRepository.getById(id)
    .then(res=> {
      setEditedItem(res, 'cv')
    })
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
    getCurrentCv,

    currentVc,
    setCurrentVc,
    getCurrentVc,
    
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
