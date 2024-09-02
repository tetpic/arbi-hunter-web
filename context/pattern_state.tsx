import { IPattern, IPatternBase } from 'data/interfaces/IPattern'
import PatternRepository from 'data/repositories/PatternRepository'
import { createContext, useContext, useState } from 'react'
import {  ProposalRequestType, SnackbarType } from 'types/enums'
import { useAppContext } from './state'
import useTranslation from 'next-translate/useTranslation'

interface IState {
  patterns: Map<number,IPattern>
  patternsNotExist: Set<ProposalRequestType>
  setPatterns: ()=>void
  createPattern: (p: IPatternBase) => void
  editPattern: (p: IPatternBase, id: number)=>void
}


const PatternContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
}

export function PatternWrapper(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const [patterns, setPatternsState] = useState<Map<number, IPattern>>(new Map())
  const [patternsNotExist, setPatternsNotExistState] = useState<Set<ProposalRequestType>>(new Set())

  const setPatterns = () => {
    setPatternsNotExistState(new Set);
    [
      ProposalRequestType.InfoRequest, 
      ProposalRequestType.Interview, 
      ProposalRequestType.Rejection, 
      ProposalRequestType.Consider
    ].forEach(el=> {
      PatternRepository.getPatternByType(el)
      .then(res=>{   
        
        if(res) {
          setPatternsState(state=> {
            state.set(res.id, res)
            return new Map(state)
          })
        }
      })
      .catch(_=>{
        
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
      appContext.showSnackbar(t('pattern_created'), SnackbarType.success)
      setPatterns()
    })
  }

  const editPattern = (p: IPatternBase, id: number) => {
    PatternRepository.editPatternById(p, id)
    .then(_=> {
      appContext.showSnackbar(t('pattern_saved'), SnackbarType.success)
      setPatterns()
    })
    .catch(_=> {
      appContext.showSnackbar(t('pattern_saveFailed'), SnackbarType.error)
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
