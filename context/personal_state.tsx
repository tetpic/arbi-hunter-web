import { IPersonalPage } from 'data/interfaces/IPersonal'
import PersonalRepository from 'data/repositories/PersonalRepository'
import { createContext, useContext, useState } from 'react'

interface IState {
  setPersonalPage: () => void
  personalPage: IPersonalPage
  updatePersonalPage: (id: number, data: Partial<IPersonalPage>) => Promise<IPersonalPage>
}

const PersonalContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
}

export function PersonalWrapper(props: Props) {
  const [personalPage, setPersonalPageState] = useState<IPersonalPage>()


  const setPersonalPage = () => {
    PersonalRepository.getPersonalPage()
    .then(res=> {
      setPersonalPageState(res)
    })
  }

  const updatePersonalPage = async (id: number, data: Partial<IPersonalPage>): Promise<IPersonalPage> => {
    return PersonalRepository.updatePersonalPage(id, data)
    .then(res=> {
      setPersonalPageState(res)
      return res
    })
  }


  const value: IState = {
    personalPage,
    setPersonalPage,
    updatePersonalPage 
  }

  return (
    <PersonalContext.Provider value={value}>
      {props.children}
    </PersonalContext.Provider>
  )
}

export function usePersonalContext() {
  return useContext(PersonalContext)
}
