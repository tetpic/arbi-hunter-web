import { IApplication } from 'data/interfaces/IApplication'
import { ICV } from 'data/interfaces/ICV'
import { FilterItem} from 'data/interfaces/IFilter'
import { IProposal, IStat } from 'data/interfaces/IProposal'
import { IVacancy } from 'data/interfaces/IVacancy'
import ApplicationRepository from 'data/repositories/ApplicationRepository'
import ProposalRepository from 'data/repositories/ProposalRepository'
import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'
import { ProposalRequestType } from 'types/enums'
import { useUserContext } from './user_state'

interface IState {
  currentVacancy: IVacancy
  VCFeedbacks: Map<number, IApplication>,
  filteredVcResponses: IApplication[],
  setFilteredVcResponses: (a: IApplication[])=> void
  setVCResponses: (id?: number)=>Promise<boolean>
  setCurrentVacancy: (v?: IVacancy|null)=> void
  setResponsesByStat: (v: ProposalRequestType) => Promise<IApplication[]|null>
  currentCV: ICV
  CVFeedbacks: Map<number, IVacancy[]>
  createProposal: (p: IProposal)=> Promise<boolean>
  filterOptions: Map<FilterItem, FilterItem>
  setFilterOptions: Dispatch<SetStateAction<Map<FilterItem, FilterItem>>>
  withFilter: (f?: IApplication[])=>void
  stats: IStat[]
  setStats: (vcId: number)=>Promise<boolean>

}

const defaultValue: IState = {
  currentVacancy: null,
  VCFeedbacks: new Map(),
  filteredVcResponses: null,
  setFilteredVcResponses: ()=>null,
  setVCResponses: ()=>null,
  setCurrentVacancy: ()=>null,
  setResponsesByStat: (v: ProposalRequestType)=> null,
  currentCV: null,
  CVFeedbacks: new Map(),
  createProposal: async()=> null,
  filterOptions: new Map(),
  setFilterOptions: ()=>null,
  withFilter: ()=>null,
  stats: [],
  setStats: (vcId: number)=>null

}

const FeedbacksContext = createContext<IState>(defaultValue)

interface Props {
  children: React.ReactNode
}

export function FeedbacksWrapper(props: Props) {
  const userContext = useUserContext()

  const [currentVacancy, setCurrentVacancyState] = useState<IVacancy>(null)
  const [VCFeedbacks, setVCResponsesState] = useState<Map<number, IApplication>>(new Map())
  const [filteredVcResponses, setFilteredVcResponsesState] = useState<IApplication[]>([])
  const [currentCV, setCurrenCVState] = useState<ICV>(null)
  const [CVFeedbacks, setCurrentCVResponsesState] = useState<Map<number, IVacancy[]>>(new Map())
  const [filterOptions, setFilterOptions] = useState<Map<FilterItem, FilterItem>>(new Map())
  const [stats, setStatsState] = useState<IStat[]>([])
  

  const setVCResponses = async (id?:number): Promise<boolean> => {
    try {
      const res = await ApplicationRepository.getVacancyApplication(id = currentVacancy?.id || id, userContext?.currentProfile?.profileType)
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

  const setCurrentVacancy = (v?: IVacancy|null) => {
    setCurrentVacancyState(v)
  }

  const setResponsesByStat = async (v: ProposalRequestType): Promise<IApplication[]> => {
    const res = await ApplicationRepository.getVacanciesByStat(v, userContext?.currentProfile?.profileType)
    return res
  }

  const setFilteredVcResponses = (a: IApplication[])=> {
    setFilteredVcResponsesState(a)
  }

  const createProposal = async (p: IProposal):Promise<boolean> => {
    try {
      const res = await ProposalRepository.createProposal(p, userContext.currentProfile?.profileType)
      return true
    } catch (e) {
      return false
    }
  }

  const withFilter = (f?: IApplication[]) => {
    const all = f||[...VCFeedbacks.values()]
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
      const res = await ApplicationRepository.getStatsCountByVacancy(vcId, userContext.currentProfile?.profileType)
      setStatsState(res)
      return true
    } catch (e) {
      return false
    }
  }




  const value: IState = {
    ...defaultValue,
    currentVacancy,
    VCFeedbacks,
    filteredVcResponses,
    setFilteredVcResponses,
    setVCResponses,
    setCurrentVacancy,
    setResponsesByStat,
    createProposal,
    filterOptions,
    setFilterOptions,
    withFilter,
    stats,
    setStats
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
