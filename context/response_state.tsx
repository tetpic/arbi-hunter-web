import { IApplication } from 'data/interfaces/IApplication'
import { ICV } from 'data/interfaces/ICV'
import { IVacancy } from 'data/interfaces/IVacancy'
import ApplicationRepository from 'data/repositories/ApplicationRepository'
import { createContext, useContext, useState } from 'react'
import { ProposalRequestType } from 'types/enums'
import { useUserContext } from './user_state'

interface IState {
  currentVacancy: IVacancy
  VCResponses: Map<number, IApplication>
  setVCResponses: (id?: number)=>void
  setCurrentVacancy: (v?: IVacancy|null)=> void
  setResponsesByStat: (v: ProposalRequestType) => Promise<IApplication[]|null>
  currentCV: ICV
  CVResponses: Map<number, IVacancy[]>
}

const defaultValue: IState = {
  currentVacancy: null,
  VCResponses: new Map(),
  setVCResponses: ()=>null,
  setCurrentVacancy: ()=>null,
  setResponsesByStat: (v: ProposalRequestType)=> null,
  currentCV: null,
  CVResponses: new Map(),

}

const ResponseContext = createContext<IState>(defaultValue)

interface Props {
  children: React.ReactNode
}

export function ResponseWrapper(props: Props) {
  const userContext = useUserContext()

  const [currentVacancy, setCurrentVacancyState] = useState<IVacancy>(null)
  const [VCResponses, setVCResponsesState] = useState<Map<number, IApplication>>(new Map())
  const [currentCV, setCurrenCVState] = useState<ICV>(null)
  const [CVResponses, setCurrentCVResponsesState] = useState<Map<number, IVacancy[]>>(new Map())

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




  const value: IState = {
    ...defaultValue,
    currentVacancy,
    VCResponses,
    setVCResponses,
    setCurrentVacancy,
    setResponsesByStat
  }

  return (
    <ResponseContext.Provider value={value}>
      {props.children}
    </ResponseContext.Provider>
  )
}

export function useResponseContext() {
  return useContext(ResponseContext)
}
