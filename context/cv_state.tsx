import { ICVCreate } from 'data/interfaces/ICV'
import { createContext, useContext, useState } from 'react'
import { DeepPartial } from 'types/types'

interface IState {
  currentCv: DeepPartial<ICVCreate>,
  setCurrentCv: (v: DeepPartial<ICVCreate>) => void

}

const defaultValue: IState = {
  currentCv: null,
  setCurrentCv: () => null
}

const CvContext = createContext<IState>(defaultValue)

interface Props {
  children: React.ReactNode
}

export function CvWrapper(props: Props) {
  const [currentCv, setCv] = useState<DeepPartial<ICVCreate>>()

  const setCurrentCv = (v: DeepPartial<ICVCreate>) => {
    setCv(state=> {return {...state, ...v}})
  }


  const value: IState = {
    ...defaultValue,
    currentCv,
    setCurrentCv
  }

  return (
    <CvContext.Provider value={value}>
      {props.children}
    </CvContext.Provider>
  )
}

export function useCvContext() {
  return useContext(CvContext)
}
