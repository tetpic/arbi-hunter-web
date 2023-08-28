import { ICVCreate, ISkill } from 'data/interfaces/ICV'
import { ILanguageKnowledge } from 'data/interfaces/IJob'
import { createContext, useContext, useState } from 'react'
import { DeepPartial } from 'types/types'


interface HelpObject {
  skills?: ISkill[],
  languageKnowledges?: ILanguageKnowledge[]
}

interface IState {
  currentCv: ICVCreate,
  setCurrentCv: (v: ICVCreate) => void

  helpObjects: HelpObject
  setHelpObjects: (o: HelpObject)=> void

  progress: number
  setProgress: (p: number) => void
}

const defaultValue: IState = {
  currentCv: null,
  setCurrentCv: () => null,

  helpObjects: null,
  setHelpObjects: ()=>null,

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
  const [helpObjects, setHelp] = useState<{[key: string]: any}>()

  const setCurrentCv = (v: ICVCreate) => {
    setCv(state=> {return {...state, ...v}})
  }

  const setProgress = (p: number) => {
    handleProgress(p)
  }

  const setHelpObjects = (o: HelpObject) => {
    setHelp(state=> {return {...state, ...o}})
  }

  const value: IState = {
    ...defaultValue,
    currentCv,
    setCurrentCv,

    helpObjects,
    setHelpObjects,

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
