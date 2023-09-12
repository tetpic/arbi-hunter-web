import { IApplication } from 'data/interfaces/IApplication'
import { ICV } from 'data/interfaces/ICV'
import { IVacancy } from 'data/interfaces/IVacancy'
import ApplicationRepository from 'data/repositories/ApplicationRepository'
import { createContext, useContext, useState } from 'react'
import { ProposalRequestType } from 'types/enums'
import { useUserContext } from './user_state'

interface IState {
  currentVacancy: IVacancy
  VCFeedbacks: Map<number, IApplication>,
  filteredVcResponses: IApplication[],
  setFilteredVcResponses: (a: IApplication[])=> void
  setVCResponses: (id?: number)=>void
  setCurrentVacancy: (v?: IVacancy|null)=> void
  setResponsesByStat: (v: ProposalRequestType) => Promise<IApplication[]|null>
  currentCV: ICV
  CVFeedbacks: Map<number, IVacancy[]>
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

  const setVCResponses = (id?:number) => {
    ApplicationRepository.getVacancyApplication(id = currentVacancy?.id||id, userContext?.currentProfile?.profileType)
    .then(res=> {
      
      setVCResponsesState(state => {
        res.forEach(el=>{
          state.set(el.id, el)
        })
        return new Map(state)
      })
    })
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




  const value: IState = {
    ...defaultValue,
    currentVacancy,
    VCFeedbacks,
    filteredVcResponses,
    setFilteredVcResponses,
    setVCResponses,
    setCurrentVacancy,
    setResponsesByStat
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
