import { IVacancy } from 'data/interfaces/IVacancy'
import VacancyRepository from 'data/repositories/VacancyRepository'
import { createContext, useContext, useState } from 'react'

interface IState {
  archiveVacancies: Map<number, IVacancy>
  setArchiveVacancies: ()=>Promise<boolean>
  activeVacancies: Map<number, IVacancy>,
  setActiveVacancies: ()=>Promise<boolean>,
  editVacancy: (v: Partial<IVacancy>, id: number)=>Promise<boolean>

}

const defaultValue: IState = {
  archiveVacancies: null,
  setArchiveVacancies: async()=>null,
  activeVacancies: null,
  setActiveVacancies: ()=>null,
  editVacancy: ()=>null
 
}

const VacancyContext = createContext<IState>(defaultValue)

interface Props {
  children: React.ReactNode
}

export function VacancyWrapper(props: Props) {
  const [archiveVacancies, setArchiveVacanciesState] = useState<Map<number, IVacancy>>(new Map())
  const [activeVacancies, setActiveVacanciesState] = useState<Map<number, IVacancy>>(new Map())

  const setArchiveVacancies = async(): Promise<boolean> => {
    return VacancyRepository.getArchiveVacancies()
    .then(res=> {
      setArchiveVacanciesState(state=> {
        state.clear()
        res.forEach(e=> {
          state.set(e.id, e)
        })
        return state
      })
      return true
    })
    .catch(err=> false)
  }

  const setActiveVacancies = async(): Promise<boolean> => {
    return VacancyRepository.getActiveVacancies()
    .then(res=> {
      setActiveVacanciesState(state=> {
        state.clear()
        res.forEach(e=> {
          state.set(e.id, e)
        })
        return state
      })
      return true
    })
    .catch(err=> false)
  }

  const editVacancy = async(v: Partial<IVacancy>, id: number): Promise<boolean> => {
    return VacancyRepository.editVacancyById(v, id)
    .then(res=>{
      debugger
      return true
    })
    .catch(err=> {return false})
  }



  const value: IState = {
    ...defaultValue,
    archiveVacancies,
    setArchiveVacancies,
    activeVacancies,
    setActiveVacancies,
    editVacancy

  }

  return (
    <VacancyContext.Provider value={value}>
      {props.children}
    </VacancyContext.Provider>
  )
}

export function useVacancyContext() {
  return useContext(VacancyContext)
}
