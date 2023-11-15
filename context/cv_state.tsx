import { ICV } from 'data/interfaces/ICV'
import { ProfileType } from 'data/interfaces/IRegistration'
import CvRepository from 'data/repositories/CvRepository'
import { useRouter } from 'next/router'
import { createContext, useContext, useState } from 'react'
import { useCreateVcCvContext } from './createVcCv_state'
import { useUserContext } from './user_state'

interface IState {
  savedCvs: ICV[],
  setSavedCvs: ()=>Promise<boolean>
  saveCv: (id: number)=> Promise<boolean>
  removeCvfromSaved: (id: number) => Promise<boolean>
  deleteCv: (id: number) => void
  updateCv: (id: number, cv: ICV) =>void
  editCv: (cv: ICV) => void
}

const CvContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
}

export function CvWrapper(props: Props) {
  const router = useRouter()
  const {currentProfile} = useUserContext()
  const createVcCvContext = useCreateVcCvContext()

  const [savedCvs, setSavedCvsState] = useState<ICV[]>([])

  const setSavedCvs = async():Promise<boolean> => {
    if(currentProfile.profileType === ProfileType.Hirer){
      return CvRepository.getSavedByCurrentUser()
      .then(res=> {
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

  const editCv = (cv: ICV) => {
    createVcCvContext.setEditedItem(cv, 'cv')
    router.push(`/create/cv?id=${cv.id}`)
  }

  const value: IState = {
    savedCvs,
    setSavedCvs,
    saveCv,
    removeCvfromSaved,
    deleteCv,
    updateCv,
    editCv
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
