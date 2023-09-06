import { IManager, IManagerCreate } from 'data/interfaces/IManager'
import ManagerRepository from 'data/repositories/ManagerRepository'
import { env } from 'process'
import { createContext, useContext, useState } from 'react'
import { useUserContext } from './user_state'

interface IState {  
  managers: Map<number, IManager>
  managersPage: number
  setManagers: (page?: number, limit?: number)=> void
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
  const userContext = useUserContext()
  const [managers, setManagersState] = useState<Map<number, IManager>>(new Map())
  const [managersPage, setManagersPageState] = useState<number>(null)

  const setManagers = async(page: number = 1) => {
    
    ManagerRepository.getManagersList(page)
    .then(res=> {
      setManagersPageState(page)
      setManagersState(state=> {
        res.forEach(e=>{
          state.set(e.id, e)
        })
        return new Map(state)
      })
      return true
    })
    .catch(err=> {return false})
  } 

  const addNewManager = async(m: IManagerCreate): Promise<boolean> => {
    return ManagerRepository.createNewManager(m, userContext.currentProfile.profileType)
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
