import { IPattern, IPatternBase } from 'data/interfaces/IPattern'
import PatternRepository from 'data/repositories/PatternRepository'
import { createContext, useContext, useState } from 'react'
import { PatternTypes, SnackbarType } from 'types/enums'
import { useAppContext } from './state'

interface IState {
  patterns: Map<number,IPattern>
  patternsNotExist: Set<PatternTypes>
  setPatterns: ()=>void
  createPattern: (p: IPatternBase) => void
  editPattern: (p: IPatternBase, id: number)=>void
}


const PatternContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
}

export function PatternWrapper(props: Props) {
  const appContext = useAppContext()
  const [patterns, setPatternsState] = useState<Map<number, IPattern>>(new Map())
  const [patternsNotExist, setPatternsNotExistState] = useState<Set<PatternTypes>>(new Set())

  const setPatterns = () => {
    Object.values(PatternTypes).forEach(el=> {
      PatternRepository.getPatternByType(el)
      .then(res=>{        
        if(res) {
          setPatternsState(state=> {
            state.set(res.id, res)
            return new Map(state)
          })
        }
      })
      .catch(err=>{
        setPatternsNotExistState(state=> {
          state.add(el)
          return new Set(state)
        })
      })
    })

  }

  const createPattern = (p: IPatternBase) => {
    PatternRepository.createPatternText(p)
    .then(res=> {
      appContext.showSnackbar('Шаблон успешно создан', SnackbarType.success)
      setPatterns()
    })
  }

  const editPattern = (p: IPatternBase, id: number) => {
    PatternRepository.editPatternById(p, id)
    .then(_=> {
      appContext.showSnackbar('Шаблон успешно сохранён', SnackbarType.success)
      setPatterns()
    })
    .catch(_=> {
      appContext.showSnackbar('Не удалось сохранить шаблон', SnackbarType.error)
    })
  }

  const value: IState = {
    patterns,
    patternsNotExist,
    setPatterns,
    createPattern,
    editPattern
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
