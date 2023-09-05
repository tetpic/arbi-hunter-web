import { IManager, IManagerCreate } from 'data/interfaces/IManager'
import ManagerRepository from 'data/repositories/ManagerRepository'
import { createContext, useContext, useState } from 'react'

interface IState {  
  managers: Map<number, IManager>
  managersPage: number
  setManagers: (page: number, limit: number)=> Promise<boolean>
  addNewManager: (m: IManagerCreate) => Promise<boolean>
}

const defaultValue: IState = {
  managers: null,
  managersPage: null,
  setManagers: async()=>null,
  addNewManager: async()=>null,

}

const ManagerContext = createContext<IState>(defaultValue)

interface Props {
  children: React.ReactNode
}

export function ManagerWrapper(props: Props) {
  const [managers, setManagersState] = useState<Map<number, IManager>>(new Map())
  const [managersPage, setManagersPageState] = useState<number>(null)

  const setManagers = async(page: number, limit: number): Promise<boolean> => {
    if(page === managersPage) {return false}
    return ManagerRepository.getManagersList(page, limit)
    .then(res=> {
      setManagersPageState(page)
      setManagersState(state=> {
        res.forEach(e=>{
          state.set(e.id, e)
        })
        return state
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

  const value: IState = {
    ...defaultValue,
    managers,
    managersPage,
    setManagers,
    addNewManager,
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
