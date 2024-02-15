import { ISpecializationCategory, ISource, IFile } from 'data/interfaces/Common'
import { ICVCreate, ICV } from 'data/interfaces/ICV'
import { ILanguageKnowledge } from 'data/interfaces/IJob'
import { IVacancy, IVacancyCreate } from 'data/interfaces/IVacancy'
import CvRepository from 'data/repositories/CvRepository'
import VacancyRepository from 'data/repositories/VacancyRepository'
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useRef, useState } from 'react'
import { useUserContext } from './user_state'


export interface HelpObject {
  skills?: Map<number, ISource>,
  languageKnowledges?: Map<string, ILanguageKnowledge>,
  sources?: ISource[]
  geos?: ISource[]
  verticals?: ISource[]
  activeSources?: Map<number, ISource>
  activeGeos?: Map<number, ISource>
  activeVerticals?: Map<number, ISource>
  cityId?: number
  countryId?: number,
  categoryIds?: ISpecializationCategory[]
  assets?: IFile[]
}



export interface ICreationState {
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

  saveDraft: (data: {cv?: ICVCreate, vacancy?: IVacancyCreate}) => void

  categories:  Map<ISpecializationCategory, ISpecializationCategory[]|null>
  subCategories: Map<number, ISpecializationCategory>
  activeCategory: ISpecializationCategory
  activeSubCategory: ISpecializationCategory[]
  setCategories: ()=> Promise<boolean>
  setSubCategories: (s: string, page: number)=>Promise<ISpecializationCategory[]>
  setActiveCategory: Dispatch<SetStateAction<ISpecializationCategory>>
  setActiveSubcategory: Dispatch<SetStateAction<ISpecializationCategory[]>>
  setSubcategoriesToCategory: (s: ISpecializationCategory) => void
  
  reset: ()=>void

  setEditedItem: (item: ICV|IVacancy, type: 'cv'|'vc') => void
}


const CreateVcCvContext = createContext<Partial<ICreationState>>({})

interface Props {
  children: React.ReactNode
}

export function CreateVcCvWrapper(props: Props) {
  const userContext = useUserContext()

  const initialHelpObject: HelpObject = {
    activeSources: new Map,
    activeGeos: new Map,
    activeVerticals: new Map,
    geos: [],
    sources: [],
    verticals: [],
    skills: new Map,
    languageKnowledges: new Map,
    cityId: userContext.currentProfile?.cityId,
    countryId: userContext.currentProfile?.countryId,
    categoryIds: [],
    assets: []
  }

  const [currentCv, setCv] = useState<ICVCreate>()
  const [currentVc, setVc] = useState<IVacancy>()
  const [progress, handleProgress] = useState<number>(1)
  const [helpObjects, setHelp] = useState<HelpObject>(initialHelpObject)
  const [categories, setCategoriesState] = useState<Map<ISpecializationCategory, ISpecializationCategory[]|null>>(new Map())
  const [subCategories, setSubCategoriesState] = useState<Map<number, ISpecializationCategory>>(new Map)
  const [activeCategory, setActiveCategory] = useState<ISpecializationCategory>()
  const [activeSubCategory, setActiveSubcategory] = useState<ISpecializationCategory[]>([])
  const draftId = useRef<number>()


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

  const setCategories =():Promise<boolean> => {
    return CvRepository.getCategories()
    .then(res => {
      setCategoriesState(()=> {
        let map = new Map()
        res.forEach(el=> {
          map.set(el, null)
        })
        return map
      })
      return true
    })
  }

  const setSubCategories = (s: string, page: number): Promise<ISpecializationCategory[]> => {
    return CvRepository.getSubcategories({search: s, page, limit: 20})
    .then(res => {
      setSubCategoriesState(state => {
        state.clear()
        res.forEach(el=> {
          state.set(el.id, el)
        })
        return new Map(state)
      })
      return res
    })
  }

  const setSubcategoriesToCategory = (s: ISpecializationCategory) => {
    if(!categories.get(s)) {
      CvRepository.getSubCategoriesByCategoryId(s.id)
      .then(res => {
        setCategoriesState(state => {
          state.set(s, res)
          return new Map(state)
        })
        setSubCategoriesState(state => {
          res.forEach(el=> {
            state.set(el.id, el)
          })
          return new Map(state)
        })
      })
    }
  }

  const saveDraft = (data: {cv?: ICVCreate, vacancy?: IVacancyCreate}) => {
    if(data.cv) {
      if(!draftId.current) {      
        CvRepository.createCV(data.cv)
        .then(res => {
          draftId.current = res.id
        })
      }
      else if(draftId.current) {
        CvRepository.updateCV(draftId.current, data.cv)
      }
    }
    else if(data.vacancy ) {
      if(!draftId.current) {
        VacancyRepository.createVacancy(data.vacancy)
        .then(res => {
          draftId.current = res.id
        })
      }
      else if(draftId.current){
        VacancyRepository.editVacancyById(data.vacancy, draftId.current)
      }
    }
  }

  const setEditedItem = async<T extends ICV|IVacancy>(item: T, type: 'cv'|'vc') => {
    if(type === 'vc') {
      const vcItem = item as IVacancy
      
      setHelp(state=>{return {...state, 
        categoryIds: vcItem.categories,   
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
        skills: new Map(cvItem.skills.map(el=> [el.id, el])),
        languageKnowledges: new Map(cvItem.languageKnowledges?.map(el=> [el.language, el])),
        activeSources: new Map(cvItem?.sources&&cvItem?.sources?.map(el=> [el.id, el])),
        activeGeos: new Map(cvItem?.geos&&cvItem?.geos?.map(el=> [el.id, el]))
      }})
      setCv(state=> {return {...state, ...item,
        categoriesIds: item.categories.map(el=> el.id)
      }})
    }
  }

  const getCurrentVc = (id: number, vacancy?: IVacancy) => {
    if(vacancy) {
      setEditedItem(vacancy, 'vc')
      setActiveSubcategory(vacancy.categories)
      draftId.current = vacancy.id
      return
    }
    VacancyRepository.getVacancyById(id, userContext.currentProfile?.profileType)
    .then(res=> {
      setEditedItem(res, 'vc')
      setActiveSubcategory(res.categories)
      draftId.current = res.id
    })
  }

  const getCurrentCv = (id: number, cv?: ICV) => {
    if(cv) {
      setEditedItem(cv, 'cv')
      setActiveSubcategory(cv.categories)
      draftId.current = cv.id
      return
    }
    CvRepository.getById(id)
    .then(res=> {
      setEditedItem(res, 'cv')
      setActiveSubcategory(res.categories)
      draftId.current = res.id
    })
  }

  const reset = () => {
    handleProgress(1)
    setHelp(initialHelpObject)
    setCv(null)
    setVc(null)
  }

  const initSources = async () => {
    const [s, g, v] = await Promise.all([CvRepository.sourcesList(), CvRepository.getGeos(), CvRepository.getVerticals()])
    const cvHelpState = helpObjects
    setHelpObjects({...cvHelpState,  geos: g.data, verticals: v.data, sources: s.data})
  }

  useEffect(()=>{
    if(currentCv && subCategories && activeSubCategory.length === 0) {
      setActiveSubcategory([currentCv.categories?.find(el => subCategories.has(el.id))] || [])
    }
  }, [currentCv, subCategories])

  useEffect(()=>{
    initSources()
    setCategories()    
  }, [])
  

  const value: ICreationState = {
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

    saveDraft,

    categories,
    subCategories,
    setCategories,
    setSubCategories,
    reset,

    setEditedItem,
    activeCategory,
    activeSubCategory,
    setActiveCategory,
    setActiveSubcategory,
    setSubcategoriesToCategory
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
