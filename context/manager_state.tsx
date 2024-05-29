import { IManager, IManagerCreate } from 'data/interfaces/IManager'
import ManagerRepository from 'data/repositories/ManagerRepository'
import { createContext, useContext, useState } from 'react'

interface IState {  
  managers: Map<number, IManager>
  managersPage: number
  managersTotal: number
  setManagers: (page?: number, limit?: number)=> void
  addNewManager: (m: IManagerCreate) => Promise<boolean>
  removeManager: (managerId: number) => Promise<void>
}

const defaultValue: Partial<IState> = {}

const ManagerContext = createContext<Partial<IState>>(defaultValue)

interface Props {
  children: React.ReactNode
}

export function ManagerWrapper(props: Props) {
  const [managers, setManagersState] = useState<Map<number, IManager>>(new Map())
  const [managersPage, setManagersPageState] = useState<number>(null)
  const [managersTotal, setManagersTotal] = useState<number>(null)

  const setManagers = async(page: number = 1) => {
    ManagerRepository.getManagersList(page)
    .then(res=> {
      setManagersPageState(page)
      setManagersTotal(res.total)
      setManagersState(state=> {
        res.data.forEach(e=>{
          state.set(e.id, e)
        })
        return new Map(state)
      })
      return true
    })
    .catch(err=> {return false})
  } 

  const addNewManager = async(m: IManagerCreate): Promise<boolean> => {
    return ManagerRepository.createNewManager(m)
    .then(res=> {
      setManagersState(state=> {
        state.set(res.id, res)
        return state
      })
      return true
    })
    .catch(err=> {return false})
  }

  const removeManager = async(managerId: number) => {
    ManagerRepository.removeManager(managerId)
    .then(res => {
      setManagersState(state => {
        state.delete(managerId)
        return new Map(state)
      })
      setManagersTotal(state=>state-1)
      
    })
  }

  const value: IState = {
    managers,
    managersPage,
    managersTotal,
    setManagers,
    addNewManager,
    removeManager
  }

  return (
    <ManagerContext.Provider value={value}>
      {props.children}
    </ManagerContext.Provider>
  )
}

export function useManagerContext() {
  return useContext(ManagerContext)
}
