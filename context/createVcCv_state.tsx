import { ISpecializationCategory, ISource } from 'data/interfaces/Common'
import { ICVCreate, ICV } from 'data/interfaces/ICV'
import { ILanguageKnowledge } from 'data/interfaces/IJob'
import { IVacancy, IVacancyCreate } from 'data/interfaces/IVacancy'
import CvRepository from 'data/repositories/CvRepository'
import VacancyRepository from 'data/repositories/VacancyRepository'
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react'
import { useUserContext } from './user_state'


interface HelpObject {
  skills?: Map<number, ISource>,
  languageKnowledges?: Map<string, ILanguageKnowledge>,
  sources?: ISource[]
  activeSources?: Map<number, ISource>
  cityId?: number
  countryId?: number,
  categoryIds?: ISpecializationCategory[]
}



interface IState {
  currentCv: ICVCreate,
  setCurrentCv: (v: ICVCreate) => void
  getCurrentCv: (id: number, cv?: ICV) => void

  currentVc: IVacancy,
  setCurrentVc: (v: IVacancy) => void
  getCurrentVc: (id: number, vacancy?: IVacancy) => void

  helpObjects: HelpObject
  setHelpObjects: (o?: HelpObject)=> void

  progress: number
  setProgress: (p: number) => void

  categories:  Map<ISpecializationCategory, ISpecializationCategory[]|null>
  activeCategory: ISpecializationCategory
  activeSubCategory: ISpecializationCategory
  setCategories: ()=> void
  setSubCategories: (v: ISpecializationCategory)=>void
  setActiveCategory: Dispatch<SetStateAction<ISpecializationCategory>>
  setActiveSubcategory: Dispatch<SetStateAction<ISpecializationCategory>>
  
  reset: ()=>void

  setEditedItem: (item: ICV|IVacancy, type: 'cv'|'vc') => void

}


const CreateVcCvContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
}

export function CreateVcCvWrapper(props: Props) {
  const userContext = useUserContext()

  const initialHelpObject: HelpObject = {
    activeSources: new Map, 
    skills: new Map, 
    languageKnowledges: new Map, 
    sources: [],
    cityId: userContext.currentProfile?.cityId,
    countryId: userContext.currentProfile?.countryId,
    categoryIds: []
  }

  const [currentCv, setCv] = useState<ICVCreate>()
  const [currentVc, setVc] = useState<IVacancy>()
  const [progress, handleProgress] = useState<number>(1)
  const [helpObjects, setHelp] = useState<HelpObject>(initialHelpObject)
  const [categories, setCategoriesState] = useState<Map<ISpecializationCategory, ISpecializationCategory[]|null>>(new Map())
  const [activeCategory, setActiveCategory] = useState<ISpecializationCategory>()
  const [activeSubCategory, setActiveSubcategory] = useState<ISpecializationCategory>(null)


  const setCurrentCv = (v: ICVCreate) => {
    setCv(state=> {return {...state, ...v}})
  }

  const setCurrentVc = (v: IVacancyCreate) => {
    setVc(state=> {return {...state, ...v}})
  }

  const setProgress = (p: number) => {
    handleProgress(p)
  }

  const setHelpObjects = (o?: HelpObject) => {
    if(!o) {
      setHelp(initialHelpObject)
    }
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
        skills: new Map(vcItem.skills.map(el => [el.id, el])),
        languageKnowledges: new Map(vcItem?.languageKnowledges?.map(el=>[el.language, el])),
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
        skills: new Map(cvItem.skills.map(el=> [el.id, el])),
        languageKnowledges: new Map(cvItem.languageKnowledges?.map(el=> [el.language, el])),
        activeSources: new Map(cvItem?.sources&&cvItem?.sources?.map(el=> [el.id, el]))
      }})
      setCv(state=> {return {...state, ...item,
        categoriesIds: item.categories.map(el=> el.id)
      }})
    }
  }

  const getCurrentVc = (id: number, vacancy?: IVacancy) => {
    if(vacancy) {
      setEditedItem(vacancy, 'vc')
      return
    }
    VacancyRepository.getVacancyById(id, userContext.currentProfile?.profileType)
    .then(res=> {
      setEditedItem(res, 'vc')
    })
  }

  const getCurrentCv = (id: number, cv?: ICV) => {
    if(cv) {
      setEditedItem(cv, 'cv')
      return
    }
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

    setEditedItem,
    activeCategory,
    activeSubCategory,
    setActiveCategory,
    setActiveSubcategory,
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
