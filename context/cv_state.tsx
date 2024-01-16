import { ICV } from 'data/interfaces/ICV'
import { ProfileType } from 'data/interfaces/IRegistration'
import CvRepository from 'data/repositories/CvRepository'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react'
import { useCreateVcCvContext } from './createVcCv_state'
import { useUserContext } from './user_state'
import { IVacancyCvSearchParams } from 'data/interfaces/Common'

interface IState {
  savedCvs: ICV[],
  foundCvs: Map<number, ICV>,
  getCv: (id: number) => void
  currentCv: ICV,
  setSavedCvs: ()=>Promise<boolean>
  saveCv: (id: number)=> Promise<boolean>
  removeCvfromSaved: (id: number) => Promise<boolean>
  deleteCv: (id: number) => void
  updateCv: (id: number, cv: ICV) =>void
  editCv: (cv: ICV) => void
  findCvs: (data?: IVacancyCvSearchParams) => Promise<boolean>
  page: number,
  setPage: Dispatch<SetStateAction<number>>,
  total: number,
}

const CvContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
}

export function CvWrapper(props: Props) {
  const router = useRouter()
  const {currentProfile} = useUserContext()
  const createVcCvContext = useCreateVcCvContext()
  const [foundCvs, setFoundCvsState] = useState<Map<number, ICV>>(new Map)
  const [savedCvs, setSavedCvsState] = useState<ICV[]>([])
  const [currentCv, setCurrentCvState] = useState<ICV>(null)
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(undefined)
  

  const setSavedCvs = async():Promise<boolean> => {
    if(currentProfile.profileType === ProfileType.Hirer){
      return CvRepository.getSavedByCurrentUser()
      .then(res=> {
        //потому что с бэка, в отличие от вакансий такие данные мне не приходят...
        res = res.map(el=> {return {...el, isSavedByCurrentProfile: true}})
        setSavedCvsState(res)
        return true
      })
      .catch(err=>{
        return false
      })
    }
    else if(currentProfile.profileType === ProfileType.Employee) {
      return CvRepository.getCVListOfCurrentUser()
      .then(res=> {
        setSavedCvsState(res)
        return true
      })
      .catch(err=>{
        return false
      })
    }
  }
  
  const saveCv = async (id: number) => {
    try {
      const res = await CvRepository.addCvToSaved(id)
      setSavedCvs()
      return true
    } catch (e) {
      return false
    }
  }

  const removeCvfromSaved = async (id: number) => {
    try {
      await CvRepository.removeCvFromSaved(id)
      setSavedCvsState(state => state.filter(el => el.id !== id))
      return true
    } catch (e) {
      return false
    }
  }

  const deleteCv = (id: number) => {
    CvRepository.deleteCV(id)
    .then(_=> {
      setSavedCvsState(state=> state.filter(el=> el.id !== id))
    })
  }

  const updateCv = (id: number, cv: ICV) => {
    CvRepository.updateCV(id, cv)
    .then(_=> {
      setSavedCvs()
    })
  }

  const findCvs = async(data?: IVacancyCvSearchParams) => {
    const res = await CvRepository.findCvs(data, page, 40)
    if(typeof res === 'object') {
      setFoundCvsState(state=> {
        page === 1&& state.clear()
        res.data.forEach(el=> state.set(el.id, el))
        return new Map(state)
      })
      setTotal(res.total)
    }
    return true
  }

  const editCv = (cv: ICV) => {
    createVcCvContext.setEditedItem(cv, 'cv')
    router.push(`/create/cv?id=${cv.id}`)
  }

  const getCv = (id: number) => {
    CvRepository.getById(id)
    .then(res=> {
      setCurrentCvState(res)
    })
  }

  const value: IState = {
    savedCvs,
    foundCvs,
    setSavedCvs,
    saveCv,
    removeCvfromSaved,
    deleteCv,
    updateCv,
    editCv,
    findCvs,
    getCv,
    currentCv,
    page,
    setPage,
    total
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
