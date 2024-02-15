import { IVacancy, IVacancyCreate } from 'data/interfaces/IVacancy'
import VacancyRepository from 'data/repositories/VacancyRepository'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react'
import { IVacancyCvSearchParams } from 'data/interfaces/Common'
import { ModerationStatusType } from 'types/enums'

interface IState {
  currentVacancy: IVacancy
  setCurrentVacancy: (id: number)=> void

  draftVacancies: Map<number, IVacancy>
  archiveVacancies: Map<number, IVacancy>
  setInactiveVacancies: ()=>Promise<boolean>

  activeVacancies: Map<number, IVacancy>,
  setActiveVacancies: ()=>Promise<boolean>,

  editVacancy: (v: IVacancyCreate, id: number, published?: 'archive'|'active'|undefined)=>Promise<boolean>
  savedVCs: IVacancy[],
  setSavedVacancies: ()=>Promise<boolean>
  saveVacancy: (id: number) => void

  removeVacancyFromSaved: (id: number) => void
  removeVacancy: (id: number, published: boolean) => void

  editVcInEditor: (vc: IVacancy)=> void

  foundVacancies: Map<number, IVacancy>
  findVacancies: (data?: IVacancyCvSearchParams) => Promise<boolean>

  page: number,
  setPage: Dispatch<SetStateAction<number>>,
  total: number,

}



const VacancyContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
}

export function VacancyWrapper(props: Props) {
  const router = useRouter()
  const [archiveVacancies, setArchiveVacanciesState] = useState<Map<number, IVacancy>>(new Map())
  const [activeVacancies, setActiveVacanciesState] = useState<Map<number, IVacancy>>(new Map())
  const [draftVacancies, setDraftVacanciesState] = useState<Map<number, IVacancy>>(new Map())
  const [savedVCs, setSavedVCState] = useState<IVacancy[]>(null)
  const [foundVacancies, setFoundVacancies] = useState<Map<number, IVacancy>>(new Map)
  const [currentVacancy, setCurrentVacancyState] = useState<IVacancy>(null)
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(undefined)


  const setInactiveVacancies = async(): Promise<boolean> => {
    return VacancyRepository.getArchiveVacancies()
    .then(res=> {
      const _drafts = res.filter(e=> e.moderationStatus !== ModerationStatusType.Approved)
      const _archive = res.filter(e=> e.moderationStatus === ModerationStatusType.Approved)
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
      return true
    })
    .catch(err=> false)
  }

  const setActiveVacancies = async(): Promise<boolean> => {
    return VacancyRepository.getActiveVacancies()
    .then(res=> {
      setActiveVacanciesState(state=> {
        state.clear()
        res.forEach(e=> {
          state.set(e.id, e)
          
        })
        return new Map(state)
      })
      return true
    })
    .catch(err=> false)
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

  const removeVacancy = (id: number, published: boolean) =>{
    VacancyRepository.removeVacancy(id)
    .then(res=> {
      published?setActiveVacancies():setInactiveVacancies()
    })
  }

  const editVacancy = async(v: IVacancyCreate, id: number, published?: 'archive'|'active'): Promise<boolean> => {
    return VacancyRepository.editVacancyById(v, id)
    .then(_=>{
      if(published !==undefined) {
        published==='active'?setActiveVacancies():setInactiveVacancies()
      }
      return true
    })
    .catch(err=> {return false})
  }

  const editVcInEditor = (vc: IVacancy) => {
    router.push(`/create/vacancy?id=${vc.id}`)
  }

  const findVacancies = async (data?: IVacancyCvSearchParams):Promise<boolean> => {
    const res = await VacancyRepository.searchVacancies(data, page, 40)
    if(typeof res === 'object') {
      setFoundVacancies(state=>{
        page === 1 && state.clear()
        res.data.forEach(el=> state.set(el.id, el))
        return new Map(state)
      })
      setTotal(res.total)
    }
    return true
  }

  const setCurrentVacancy = (id: number) => {
    VacancyRepository.getVacancyById(id)
    .then(res=> {
      setCurrentVacancyState(res)
    })
  }


  const value: IState = {
    archiveVacancies,
    draftVacancies,
    foundVacancies,
    findVacancies,
    setInactiveVacancies,
    activeVacancies,
    setActiveVacancies,
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
    setPage,
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
