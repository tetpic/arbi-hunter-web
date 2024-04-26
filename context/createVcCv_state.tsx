import { ISpecializationCategory, ISource, IFile, ICategorySearchParams, ITariff } from 'data/interfaces/Common'
import { ICVCreate, ICV } from 'data/interfaces/ICV'
import { ILanguageKnowledge } from 'data/interfaces/IJob'
import { IVacancy, IVacancyCreate } from 'data/interfaces/IVacancy'
import CvRepository from 'data/repositories/CvRepository'
import VacancyRepository from 'data/repositories/VacancyRepository'
import { Dispatch, MutableRefObject, SetStateAction, createContext, useContext, useEffect, useRef, useState } from 'react'
import { useUserContext } from './user_state'
import CategoryRepository from 'data/repositories/CategoryRepository'
import { IGeoName, ISearchCityResult } from 'data/interfaces/ILocation'
import SkillsRepository from 'data/repositories/SkillsRepository'


export interface HelpObject {
  skills?: Map<number, ISource>,
  languageKnowledges?: Map<string, ILanguageKnowledge>,
  sources?: ISource[]
  geos?: ISource[]
  verticals?: ISource[]
  activeSources?: Map<number, ISource>
  activeGeos?: Map<number, ISource>
  activeVerticals?: Map<number, ISource>
  cityId?: number,
  cities?: ISearchCityResult[],
  countries?: IGeoName[],
  countryId?: number,
  categoryIds?: ISpecializationCategory[]
  assets?: IFile[]
}



export interface ICreationState {
  currentCv: ICVCreate,
  setCurrentCv: (v: ICVCreate) => void
  getCurrentCv: (id: number, cv?: ICV) => void
  tariffs: Map<number,ITariff>
  setTariffs:  Dispatch<SetStateAction<Map<number, ITariff>>>

  currentVc: IVacancy,
  setCurrentVc: (v: IVacancy) => void
  getCurrentVc: (id: number, vacancy?: IVacancy) => void

  helpObjects: HelpObject
  setHelpObjects: (o?: HelpObject)=> void

  progress: number
  setProgress: (p: number) => void

  draftId: MutableRefObject<number>
  draftItem: MutableRefObject<Partial<ICV|IVacancy>>
  saveDraft: (data: {cv?: ICVCreate, vacancy?: IVacancyCreate}) => void

  categories:  Map<ISpecializationCategory, ISpecializationCategory[]|null>
  subCategories: Map<number, ISpecializationCategory>
  activeCategory: ISpecializationCategory
  activeSubCategory: ISpecializationCategory[]
  setCategories: ()=> Promise<boolean>
  setSubCategories: (data: Partial<ICategorySearchParams>|null, categories?: ISpecializationCategory[]) => Promise<ISpecializationCategory[]>
  setActiveCategory: Dispatch<SetStateAction<ISpecializationCategory>>
  setActiveSubcategory: Dispatch<SetStateAction<ISpecializationCategory[]>>
  setSubcategoriesToCategory: (s: ISpecializationCategory) => void

  setEditedItem: (item: ICV|IVacancy, type: 'cv'|'vc') => void

  recommendedSkills: Map<number, ISource>
  setRecommendedSkills: () => void


}


const CreateVcCvContext = createContext<Partial<ICreationState>>({})

interface Props {
  children: React.ReactNode
  progress?: number
}

export function CreateVcCvWrapper(props: Props) {
  const userContext = useUserContext()

  const initialHelpObject: HelpObject = {
    activeSources: new Map,
    activeGeos: new Map,
    activeVerticals: new Map,
    skills: new Map,
    languageKnowledges: new Map,
    cityId: userContext.currentProfile?.cityId,
    countryId: userContext.currentProfile?.countryId,
    categoryIds: [],
    assets: [],
    countries: [],
    cities: [],
  }

  const [currentCv, setCv] = useState<ICVCreate>()
  const [currentVc, setVc] = useState<IVacancy>()
  const [progress, handleProgress] = useState<number>(props.progress||1)
  const [helpObjects, setHelp] = useState<HelpObject>(initialHelpObject)
  const [categories, setCategoriesState] = useState<Map<ISpecializationCategory, ISpecializationCategory[]|null>>(new Map())
  const [subCategories, setSubCategoriesState] = useState<Map<number, ISpecializationCategory>>(new Map)
  const [activeCategory, setActiveCategory] = useState<ISpecializationCategory>()
  const [activeSubCategory, setActiveSubcategory] = useState<ISpecializationCategory[]>([])
  const draftId = useRef<number>()
  const draftItem = useRef<Partial<ICV|IVacancy>>({})
  const [tariffs, setTariffs] = useState<Map<number,ITariff>>(new Map)
  const [recommendedSkills, setRecommendedSkillsState] = useState<Map<number, ISource>>(new Map)


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
    return CategoryRepository.getCategories()
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

  const setSubCategories = (data: Partial<ICategorySearchParams>|null, categories?: ISpecializationCategory[]): Promise<ISpecializationCategory[]> => {
    
    if(categories && categories.length > 0) {
      setSubCategoriesState(state => {
        categories.forEach(el=> {
          state.set(el.id, el)
        })
        return new Map(state)
      })
      return
    }
    
    return CategoryRepository.getSubcategories({limit: 20, ...data})
    .then(res => {
      setSubCategoriesState(state => {
        state.clear()
        res.slice(0, data.limit||20).forEach(el=> {
          state.set(el.id, el)
        })
        return new Map(state)
      })
      return res
    })
  }

  const setSubcategoriesToCategory = (s: ISpecializationCategory) => {
    if(!categories.get(s)) {
      CategoryRepository.getSubCategoriesByCategoryId(s.id, {withCVsCount: true, withNewCVsCount: true})
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
          draftItem.current = res
          draftId.current = res.id
        })
      }
      else if(draftId.current) {
        CvRepository.updateCV(draftId.current, data.cv)
        .then(res => {
          draftItem.current = res
        })
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
        .then(res => {
          draftItem.current = res
        })
      }
    }
  }

  const setEditedItem = async<T extends ICV|IVacancy>(item: T, type: 'cv'|'vc') => {
    if(type === 'vc') {
      const vcItem = item as IVacancy
      draftItem.current = vcItem
      setHelp(state=>{return {...state, 
        categoryIds: vcItem.categories,   
        skills: new Map(vcItem.skills.map(el => [el.id, el])),
        languageKnowledges: new Map(vcItem?.languageKnowledges?.map(el=>[el.language, el])),
        activeSources: new Map(vcItem?.sources&&vcItem?.sources?.map(el=> [el.id, el])),
        activeGeos: new Map(vcItem?.geos&&vcItem?.geos?.map(el=> [el.id, el])),
        activeVerticals: new Map(vcItem?.verticals&&vcItem?.verticals?.map(el=> [el.id, el])),
      }})
      setVc(state=> {return {...state, ...item,
        categoriesIds: item.categories.map(el=> el.id),
      }})
    } 
    else if(type === 'cv') {
      const cvItem = item as ICV
      draftItem.current = cvItem
      setHelp(state=>{return {...state, 
        categoryIds: cvItem.categories,   
        skills: new Map(cvItem.skills.map(el=> [el.id, el])),
        languageKnowledges: new Map(cvItem.languageKnowledges?.map(el=> [el.language, el])),
        activeSources: new Map(cvItem?.sources&&cvItem?.sources?.map(el=> [el.id, el])),
        activeGeos: new Map(cvItem?.geos&&cvItem?.geos?.map(el=> [el.id, el])),
        activeVerticals: new Map(cvItem?.verticals&&cvItem?.verticals?.map(el=> [el.id, el])),
        assets: cvItem.assets
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

  const setRecommendedSkills = () => {
    SkillsRepository.getRecommendedSkills(activeSubCategory[0].id)
    .then(res => {
      if(res) {
        setRecommendedSkillsState(new Map(res.data.map(el=> [el.id, el])))
        console.log(res)
      }
    })
  }





  useEffect(()=>{
    if(currentCv && subCategories && activeSubCategory.length === 0) {
      setActiveSubcategory([currentCv.categories?.find(el => subCategories.has(el.id))] || [])
    }
  }, [currentCv, subCategories])

  useEffect(()=>{
    setCategories()    
  }, [])
  

  const value: ICreationState = {
    currentCv,
    setCurrentCv,
    getCurrentCv,

    tariffs,
    setTariffs,

    currentVc,
    setCurrentVc,
    getCurrentVc,

    helpObjects,
    setHelpObjects,

    progress,
    setProgress,

    saveDraft,
    draftId,
    draftItem,

    categories,
    subCategories,
    setCategories,
    setSubCategories,

    setEditedItem,
    activeCategory,
    activeSubCategory,
    setActiveCategory,
    setActiveSubcategory,
    setSubcategoriesToCategory,
    recommendedSkills,
    setRecommendedSkills
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
