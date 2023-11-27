import { IApplication } from 'data/interfaces/IApplication'
import { ICV } from 'data/interfaces/ICV'
import { FilterItem, FilterItems} from 'data/interfaces/IFilter'
import { IProposal, IStat } from 'data/interfaces/IProposal'
import { IVacancy } from 'data/interfaces/IVacancy'
import ApplicationRepository from 'data/repositories/ApplicationRepository'
import ProposalRepository from 'data/repositories/ProposalRepository'
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { EducationTypes, Genders, ProposalRequestType, WorkExperience } from 'types/enums'
import { arrayFromEnum, TranslateEducationType, TranslateGenderType, TranslateWorkExperience } from 'utils/enumsTranslations'
import { useUserContext } from './user_state'

interface IState {
  currentVacancy: IVacancy
  VCFeedbacks: Map<number, IApplication>,
  filteredVcResponses: IApplication[],
  setFilteredVcResponses: (a: IApplication[])=> void
  setVCResponses: (id?:number)=>Promise<boolean>
  setCVResponses: (cvId?: number)=>Promise<boolean>
  setCurrentVacancy: (v?: IVacancy|null)=> void
  setResponsesByStat: (v: ProposalRequestType) => Promise<IApplication[]|null>
  currentCV: ICV
  CVFeedbacks: Map<number, IProposal>
  createProposal: (p: IProposal)=> Promise<boolean|IProposal>
  stats: IStat[]
  setStats: (vcId: number)=>Promise<boolean>
  setCurrentCvResponsesState: Dispatch<SetStateAction<{
    cvId?: number;
    vacancyId?: number;
  }>>
  filters:Map<FilterItems, FilterItem>
  setFilters: Dispatch<SetStateAction<Map<FilterItems, FilterItem>>>
  filterOptions: Map<FilterItem, FilterItem>
  withFilter: (f?: IApplication[])=>void
  setFilterOptions: (value?: FilterItem, index?: number)=>void
  sorted:IApplication[],
  setSorted: Dispatch<SetStateAction<IApplication[]>>,
  getFilterItems : (p: FilterItems)=> FilterItem
}



const FeedbacksContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
}

export function FeedbacksWrapper(props: Props) {
  const userContext = useUserContext()

  const [currentCvResponses, setCurrentCvResponsesState] = useState<{cvId?: number, vacancyId?: number}>({})

  const [currentVacancy, setCurrentVacancyState] = useState<IVacancy>(null)
  const [VCFeedbacks, setVCResponsesState] = useState<Map<number, IApplication>>(new Map())
  const [filteredVcResponses, setFilteredVcResponsesState] = useState<IApplication[]>([])
  const [currentCV, setCurrenCVState] = useState<ICV>(null)
  const [CVFeedbacks, setAllCVResponsesState] = useState<Map<number, IProposal>>(new Map())
  const [sorted, setSorted] = useState<IApplication[]|null>(null)
  const [filters, setFilters] = useState<Map<FilterItems, FilterItem>>(new Map())
  const [filterOptions, setFilterOptionsState] = useState<Map<FilterItem, FilterItem>>(new Map())
  const [stats, setStatsState] = useState<IStat[]>([])
  

  const setVCResponses = async (id?:number): Promise<boolean> => {
    try {
      const res = await ApplicationRepository.getVacancyApplication(id = currentVacancy?.id || id)
      setVCResponsesState(state => {
        state.clear()
        res.forEach(el => {
          state.set(el.id, el)
        })
        return new Map(state)
      })
      return true
    } catch (err) {
      return false
    }
  }

  const setCVResponses = async(cvId?: number): Promise<boolean> => {
    try{
      setAllCVResponsesState(new Map)
      const allProposals = await Promise.all([ApplicationRepository.getAllApplications({cvId: currentCvResponses.cvId}), ProposalRepository.getProposalByProfileType({s: currentCvResponses})])
      allProposals.forEach(async(proposal) => {
        setAllCVResponsesState(state => {
          proposal.forEach((p, index) => {
            state.set(p.id, p)
          })
          return new Map(state)
        })
      })
      return true
    }
    catch(err) {
      return false
    }
    
    // return ProposalRepository.getProposalByProfileType(userContext?.currentProfile?.profileType)
    // .then(async proposal=> {

    //   const vacancies = Promise.all(proposal.map(el=> VacancyRepository.getVacancyById(el.vacancyId, userContext?.currentProfile?.profileType)))
    //   const res = await vacancies
    //   setCurrentCVResponsesState(new Map())
    //   res.forEach((vc, index) => {
    //     setCurrentCVResponsesState(state => {
    //       state.set(proposal[index], vc)
    //       return new Map(state)
    //     })
    //   })
    //   return true
      
    // })
    // .catch(err=>{
    //   return false
    // })
  }

  const setFilterOptions =(value?: FilterItem, index?: number)=> {
    
    setFilterOptionsState(state=> {
      if(value===undefined) {
        state.clear()
        return new Map(state)
      }
      if(index === undefined) {
        state.delete(value)
        return new Map(state)
      }
      
      state.set(value, {...value, activeItem: value.items[index], translatedActiveItem: value.translatedItems[index]})
      return new Map(state)
    })
  }

  const setCurrentVacancy = (v?: IVacancy|null) => {
    setCurrentVacancyState(v)
  }

  const setResponsesByStat = async (v: ProposalRequestType): Promise<IApplication[]> => {
    const res = await ApplicationRepository.getVacanciesByStat(v)
    return res
  }

  const setFilteredVcResponses = (a: IApplication[])=> {
    setFilteredVcResponsesState(a)
  }

  const createProposal = async (p: IProposal):Promise<boolean|IProposal> => {
    try {
      const res = await ProposalRepository.createProposal(p)
      if (res) {
        return res
      }
      else {
        throw new Error
      }
    } catch (e) {
      return false
    }
  }

  const createApplication = async (a: IApplication): Promise<boolean> => {
    try {
      const res = await ApplicationRepository.sendApplication(a)
      if (!res.errors) {
        return true
      }
      else {
        throw new Error
      }
    } catch (e) {
      return false
    }
  }

  const withFilter = (f?: IApplication[]) => {
    const all = sorted||[...VCFeedbacks.values()]
    if(filterOptions.size === 0) {
      setFilteredVcResponses(all)
    }
    let filtered: IApplication[] =  all;
    [...filterOptions.entries()].forEach(([key, value])=>{
      let keyType = value.type as keyof ICV
      if(keyType === 'age') {
        let ageArr = value.activeItem.split(' ')
        filtered = filtered.filter(el=> el.cv.age > +ageArr[0]&&el.cv.age < +ageArr[1])
      }
      else {
        filtered = filtered.filter(el=> el.cv[keyType] === value.activeItem)
      }
      setFilteredVcResponses(filtered)
    })
  }

  const setStats = async (vcId: number):Promise<boolean> => {
    try {
      const res = await ApplicationRepository.getStatsCountByVacancy(vcId)
      setStatsState(res)
      return true
    } catch (e) {
      return false
    }
  }

  const getFilterItems = (p: FilterItems): FilterItem => {
    let arr:any[] = []
    switch(p) {
      case FilterItems.Age:
        arr = ['18 30', '30 40', '40 50', '50 100']
        return {type:p, items: arr, translatedItems: ['от 18 до 30 лет', 'от 30 до 40 лет', 'от 40 до 50 лет', 'больше 60 лет'], activeItem: null, translatedActiveItem: null,  translation: 'Возраст'}
      case FilterItems.Education:
        arr = arrayFromEnum(EducationTypes)
        return {type:p, items: arr, translatedItems: arr.map(el=>TranslateEducationType(el)), activeItem: null, translatedActiveItem: null, translation: 'Образование'}
      case FilterItems.Experience:
        arr = arrayFromEnum(WorkExperience)
        return { type:p, items: arr, translatedItems: arr.map(el=> TranslateWorkExperience(el)), activeItem: null, translatedActiveItem: null,  translation: 'Опыт'}
      case FilterItems.Gender:
        arr = arrayFromEnum(Genders)
        return { type:p, items: arr, translatedItems: arr.map(el=> TranslateGenderType(el)), activeItem: null, translatedActiveItem: null,  translation: 'Пол'}
      case FilterItems.New:
        return {type: p, translation: 'Только новые'}
    }
  }

  useEffect(()=>{    
    withFilter()
  }, [filterOptions])

  useEffect(()=>{
    Object.values(FilterItems).forEach(el => {
      setFilters(state=> {
        state.set(el, getFilterItems(el))
        return new Map(state)
      })
    })
  }, [])

  useEffect(()=>{
    withFilter()
  }, [sorted])

  const value: IState = {
    currentVacancy,
    VCFeedbacks,
    CVFeedbacks,
    filteredVcResponses,
    setFilteredVcResponses,
    setVCResponses,
    setCVResponses,
    currentCV,
    sorted,
    setCurrentVacancy,
    setResponsesByStat,
    createProposal,
    setCurrentCvResponsesState,
    filters,
    setFilters,
    filterOptions,
    setFilterOptions,
    withFilter,
    stats,
    setStats,
    setSorted,
    getFilterItems
  }

  return (
    <FeedbacksContext.Provider value={value}>
      {props.children}
    </FeedbacksContext.Provider>
  )
}

export function useFeedbacksContext() {
  return useContext(FeedbacksContext)
}
