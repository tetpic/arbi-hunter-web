import { IPattern, IPatternBase } from 'data/interfaces/IPattern'
import PatternRepository from 'data/repositories/PatternRepository'
import { createContext, useContext, useState } from 'react'
import { PatternTypes } from 'types/enums'
import { useAppContext } from './state'
import { useUserContext } from './user_state'

interface IState {
  patterns: Map<number,IPattern>
  setPatterns: ()=>void
  createPattern: (p: IPatternBase) => void
}

const defaultValue: IState = {
  patterns: new Map(),
  setPatterns: ()=>null,
  createPattern: ()=> null
}

const PatternContext = createContext<IState>(defaultValue)

interface Props {
  children: React.ReactNode
}

export function PatternWrapper(props: Props) {

  const appContext = useAppContext()
  const {currentProfile} = useUserContext()

  const [patterns, setPatternsState] = useState<Map<number, IPattern>>(new Map())

  const setPatterns = () => {
    Object.values(PatternTypes).forEach(el=> {
      PatternRepository.getPatternByType(el, currentProfile.profileType)
      .then(res=>{
        
        if(res) {
          setPatternsState(state=> {
            state.set(res.id, res)
            return new Map(state)
          })
        }
      })
      .catch(err=>{
        console.warn(err)
      })
    })

  }

  const createPattern = (p: IPatternBase) => {
    PatternRepository.createPatternText(p, currentProfile.profileType)
    .then(res=> {
      
    })
  }






  const value: IState = {
    ...defaultValue,
    patterns,
    setPatterns,
    createPattern,

  }

  return (
    <PatternContext.Provider value={value}>
      {props.children}
    </PatternContext.Provider>
  )
}

export function usePatternContext() {
  return useContext(PatternContext)
}
