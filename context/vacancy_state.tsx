import { IVacancy, IVacancyCreate } from 'data/interfaces/IVacancy'
import VacancyRepository from 'data/repositories/VacancyRepository'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react'
import { useCreateVcCvContext } from './createVcCv_state'
import { IVacancyCvSearchParams } from 'data/interfaces/Common'

interface IState {
  currentVacancy: IVacancy
  setCurrentVacancy: (id: number)=> void

  archiveVacancies: Map<number, IVacancy>
  setArchiveVacancies: ()=>Promise<boolean>

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
  const createVcCvContext = useCreateVcCvContext()
  const [archiveVacancies, setArchiveVacanciesState] = useState<Map<number, IVacancy>>(new Map())
  const [activeVacancies, setActiveVacanciesState] = useState<Map<number, IVacancy>>(new Map())
  const [savedVCs, setSavedVCState] = useState<IVacancy[]>(null)
  const [foundVacancies, setFoundVacancies] = useState<Map<number, IVacancy>>(new Map)
  const [currentVacancy, setCurrentVacancyState] = useState<IVacancy>(null)
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(undefined)


  const setArchiveVacancies = async(): Promise<boolean> => {
    return VacancyRepository.getArchiveVacancies()
    .then(res=> {
      setArchiveVacanciesState(state=> {
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
      setSavedVCState(res)
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
      published?setActiveVacancies():setArchiveVacancies()
    })
  }

  const editVacancy = async(v: IVacancyCreate, id: number, published?: 'archive'|'active'): Promise<boolean> => {
    return VacancyRepository.editVacancyById(v, id)
    .then(_=>{
      if(published !==undefined) {
        published==='active'?setActiveVacancies():setArchiveVacancies()
      }
      return true
    })
    .catch(err=> {return false})
  }

  const editVcInEditor = (vc: IVacancy) => {
    createVcCvContext.setEditedItem(vc, 'vc')
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
    foundVacancies,
    findVacancies,
    setArchiveVacancies,
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
