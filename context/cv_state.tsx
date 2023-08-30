import { ICVCreate, ISkill, Source, ICategory } from 'data/interfaces/ICV'
import { ILanguageKnowledge } from 'data/interfaces/IJob'
import CvRepository from 'data/repositories/CvRepository'
import { createContext, useContext, useState } from 'react'

interface ILangHelper extends ILanguageKnowledge {
  ru?: string
}

interface HelpObject {
  skills?: ISkill[],
  languageKnowledges?: ILangHelper[],
  sources?: Source[]
  activeSources?: Set<Source>
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

  helpObjects: HelpObject
  setHelpObjects: (o: HelpObject)=> void

  progress: number
  setProgress: (p: number) => void

  categories:  Map<ICategory, ICategory[]|null>
  setCategories: ()=> void
  setSubCategories: (v: ICategory)=>void
}

const defaultValue: IState = {
  currentCv: null,
  setCurrentCv: () => null,

  helpObjects: initialHelpObject,
  setHelpObjects: ()=>null,

  progress: 1,
  setProgress: (p) => null,

  categories: new Map(),
  setCategories: () => null,
  setSubCategories: () => null

}

const CvContext = createContext<IState>(defaultValue)

interface Props {
  children: React.ReactNode
}

export function CvWrapper(props: Props) {
  const [currentCv, setCv] = useState<ICVCreate>()
  const [progress, handleProgress] = useState<number>(1)
  const [helpObjects, setHelp] = useState<HelpObject>({activeSources: new Set(), skills: [], languageKnowledges: [], sources: [] })
  const [categories, setCategoriesState] = useState<Map<ICategory, ICategory[]|null>>(new Map())

  const setCurrentCv = (v: ICVCreate) => {
    setCv(state=> {return {...state, ...v}})
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
  

  const value: IState = {
    ...defaultValue,
    currentCv,
    setCurrentCv,

    helpObjects,
    setHelpObjects,

    progress,
    setProgress,

    categories,
    setCategories,
    setSubCategories
  }

  return (
    <CvContext.Provider value={value}>
      {props.children}
    </CvContext.Provider>
  )
}

export function useCvContext() {
  return useContext(CvContext)
}
