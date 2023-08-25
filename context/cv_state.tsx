import { ICVCreate } from 'data/interfaces/ICV'
import { createContext, useContext, useState } from 'react'
import { DeepPartial } from 'types/types'

interface IState {
  currentCv: ICVCreate,
  setCurrentCv: (v: ICVCreate) => void
  progress: number
  setProgress: (p: number) => void

}

const defaultValue: IState = {
  currentCv: null,
  setCurrentCv: () => null,
  progress: 1,
  setProgress: (p) => null
}

const CvContext = createContext<IState>(defaultValue)

interface Props {
  children: React.ReactNode
}

export function CvWrapper(props: Props) {
  const [currentCv, setCv] = useState<ICVCreate>()
  const [progress, handleProgress] = useState<number>(1)

  const setCurrentCv = (v: ICVCreate) => {
    setCv(state=> {return {...state, ...v}})
  }

  const setProgress = (p: number) => {
    handleProgress(p)
  }


  const value: IState = {
    ...defaultValue,
    currentCv,
    setCurrentCv,
    progress,
    setProgress
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
