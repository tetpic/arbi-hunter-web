import { IVacancy, IVacancyCreate } from 'data/interfaces/IVacancy'
import VacancyRepository from 'data/repositories/VacancyRepository'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, createContext, useCallback, useContext, useState } from 'react'
import { IVacancyCvSearchParams } from 'data/interfaces/Common'
import { ModerationStatusType, SnackbarType } from 'types/enums'
import { useAppContext } from './state'
import { AppMetricaEvent, sendToMetrika } from 'utils/sendToMetrics'
import useTranslation from 'next-translate/useTranslation'

interface IState {
  currentVacancy: IVacancy
  setCurrentVacancy: (data: {id?: number, vacancy?: IVacancy})=> void

  draftVacancies: Map<number, IVacancy>
  archiveVacancies: Map<number, IVacancy>
  activeVacancies: Map<number, IVacancy>,
  setVacancies: (disableLoader?: boolean)=>Promise<boolean>

  addToBlackList: (id?: number) => void
  setBlackListedVacancies: () => void
  removeFromBlackList: (id?: number) => void


  editVacancy: (v: IVacancyCreate, id: number, published?: 'archive'|'active'|undefined)=>Promise<boolean>
  savedVCs: IVacancy[],
  setSavedVacancies: ()=>Promise<boolean>
  saveVacancy: (id: number) => void

  removeVacancyFromSaved: (id: number) => void
  removeVacancy: (id: number, type?: 'drafts' | 'archive') => void

  editVcInEditor: (vc: IVacancy)=> void

  foundVacancies: Map<number, IVacancy>
  findVacancies: (data?: IVacancyCvSearchParams, _page?: number) => Promise<boolean>

  page: number,
  setPage: Dispatch<SetStateAction<number>>,
  total: number,
  isLoading: boolean
  searchString: string
  setSearchString: Dispatch<SetStateAction<string>>
  refreshVacancyInFound: (v: IVacancy) => void
}



const VacancyContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
  vacancy?: IVacancy
}

export function VacancyWrapper(props: Props) {
  const {t} = useTranslation()
  const router = useRouter()
  const appContext = useAppContext()
  const [archiveVacancies, setArchiveVacanciesState] = useState<Map<number, IVacancy>>(new Map())
  const [activeVacancies, setActiveVacanciesState] = useState<Map<number, IVacancy>>(new Map())
  const [draftVacancies, setDraftVacanciesState] = useState<Map<number, IVacancy>>(new Map())
  const [savedVCs, setSavedVCState] = useState<IVacancy[]>(null)
  const [foundVacancies, setFoundVacancies] = useState<Map<number, IVacancy>>(new Map)
  const [currentVacancy, setCurrentVacancyState] = useState<IVacancy>(props.vacancy||null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(undefined)
  const [searchString, setSearchString] = useState<string>('')


  const setVacancies = async(disableLoader?: boolean): Promise<boolean> => {
    
    !disableLoader&& setIsLoading(true)
    return VacancyRepository.getUserVacancies()
    .then(res=> {
      setSavedVCState(res)
      const _drafts = res.filter(e=> (!e.published||e.moderationStatus !== ModerationStatusType.Approved)&& !e.publishedAt)
      const _archive = res.filter(e=> (!e.published ||e.moderationStatus !== ModerationStatusType.Approved)&& e.publishedAt)
      const _active = res.filter(e => e.published && e.moderationStatus === ModerationStatusType.Approved)
      setArchiveVacanciesState(state=> {
        state.clear()
        _archive.forEach(e=> {
          state.set(e.id, e)
        })
        return new Map(state)
      })
      setDraftVacanciesState(state=> {
        state.clear()
        _drafts.forEach(e=> {
          state.set(e.id, e)
        })
        return new Map(state)
      })
      setActiveVacanciesState(state=> {
        state.clear()
        _active.forEach(e=> {
          state.set(e.id, e)
        })
        return new Map(state)
      })
      !disableLoader&& setIsLoading(false)
      return true
    })
    .catch(err=> false)
  }

  // const setActiveVacancies = async(): Promise<boolean> => {
  //   return VacancyRepository.getActiveVacancies()
  //   .then(res=> {
  //     setActiveVacanciesState(state=> {
  //       state.clear()
  //       res.forEach(e=> {
  //         state.set(e.id, e)
          
  //       })
  //       return new Map(state)
  //     })
  //     return true
  //   })
  //   .catch(err=> false)
  // }
  

  const addToBlackList = (id?: number)  => {
    VacancyRepository.addToBlackList(id||currentVacancy.id)
    .then(_=> {
      router.back()
      appContext.showSnackbar(t('vacancy_page_setHidden'), SnackbarType.success)
    })
  }

  const removeFromBlackList = (id?: number)  => {
    VacancyRepository.removeFromBlackList(id)
    .then(_ => {
      setSavedVCState(state=> state.filter(el => el.id !== id))
    })
  }

  const setSavedVacancies = ():Promise<boolean> => {
    return VacancyRepository.getSavedFromCurrentProfile()
    .then(res=> {
      setSavedVCState(res.data)
      return true
    })
    .catch(_=> false)
  }
  

  const saveVacancy = (id: number) => {
    sendToMetrika(AppMetricaEvent.AddToSaved)
    VacancyRepository.addVcToSaved(id)
    .then(res=> {
      setSavedVacancies()
    })
  }

  const removeVacancyFromSaved = (id: number) => {
    VacancyRepository.removeVcFromSaved(id)
    .then(res=> {
      setSavedVacancies()
    })
  }

  const removeVacancy = (id: number, type?: 'drafts' | 'archive') =>{
    if(!type) {
      setActiveVacanciesState(state => {
        state.delete(id)
        return new Map(state)
      })
    }
    if(type === 'archive') {
      setArchiveVacanciesState(state => {
        state.delete(id)
        return new Map(state)
      })
    }
    if(type === 'drafts') {
      setDraftVacanciesState(state => {
        state.delete(id)
        return new Map(state)
      })
    }
    VacancyRepository.removeVacancy(id)
    .then(res=> {
      // setVacancies(true)
    })
  }

  const editVacancy = async(v: IVacancyCreate, id: number, published?: 'archive'|'active'): Promise<boolean> => {
    return VacancyRepository.editVacancyById(v, id)
    .then(_=>{
      if(published !==undefined) {
        setVacancies(true)
      }
      return true
    })
    .catch(_=> {return false})
  }

  const editVcInEditor = (vc: IVacancy) => {
    router.push(`/create/vacancy?id=${vc.id}`)
  }

  const setBlackListedVacancies = () => {
    VacancyRepository.getBlacklistedVacancies()
    .then(res => {
      setSavedVCState(res.data)
    })
  }

  const findVacancies = useCallback(async (data?: IVacancyCvSearchParams, _page?: number):Promise<boolean> => {
    try {

      const res = await VacancyRepository.searchVacancies(data, _page||page, 10).catch(e => {})
      if(typeof res === 'object') {
        setFoundVacancies(state=>{
          (_page||page === 1) && state.clear()
          res.data.forEach(el=> state.set(el.id, el))
          return new Map(state)
        })
        setTotal(res.total)
      }
    }
    catch{(e: any)=> {
      console.warn(e)
      return false
    }}
    return true
  }, [page])

  const refreshVacancyInFound = (v: IVacancy) => {
    VacancyRepository.getVacancyById(v.id)
    .then(res => {
      setFoundVacancies(state => {
        state.set(res.id, res)
        return new Map(state)
      })
    })

  }

  const setCurrentVacancy = (data: {id?: number, vacancy?: IVacancy}) => {
    if(data.id) {
      VacancyRepository.getVacancyById(data.id)
      .then(res=> {
        setCurrentVacancyState(res)
      })
    }
    else if(data.vacancy) {
      setCurrentVacancyState(data.vacancy)
    }
  }


  const value: IState = {
    archiveVacancies,
    draftVacancies,
    foundVacancies,
    refreshVacancyInFound,
    findVacancies,
    setVacancies,
    addToBlackList,
    removeFromBlackList,
    setBlackListedVacancies,
    activeVacancies,
    editVacancy,
    savedVCs,
    setSavedVacancies,
    saveVacancy,
    removeVacancyFromSaved,
    removeVacancy,
    editVcInEditor,
    currentVacancy,
    setCurrentVacancy,
    page,
    total,
    isLoading,
    setPage,
    searchString,
    setSearchString
  }

  return (
    <VacancyContext.Provider value={value}>
      {props.children}
    </VacancyContext.Provider>
  )
}

export function useVacancyContext() {
  return useContext(VacancyContext)
}
