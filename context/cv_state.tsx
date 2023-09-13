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
  saveCv: (id: number)=> void
  removeCvfromSaved: (id: number) => void
  deleteCv: (id: number) => void
  updateCv: (id: number, cv: ICV) =>void
  editCv: (cv: ICV) => void
}

const defaultValue: IState = {
  savedCvs: null,
  setSavedCvs: async()=> null,
  saveCv: () => null,
  removeCvfromSaved: () => null,
  deleteCv: ()=>null,
  updateCv: ()=> null,
  editCv: (cv: ICV)=> null
}

const CvContext = createContext<IState>(defaultValue)

interface Props {
  children: React.ReactNode
}

export function CvWrapper(props: Props) {
  const {currentProfile} = useUserContext()
  const createVcCvContext = useCreateVcCvContext()
  const router = useRouter()

  const [savedCvs, setSavedCvsState] = useState<ICV[]>([])

  const setSavedCvs = async():Promise<boolean> => {
    if(currentProfile.profileType === ProfileType.Hirer){
      return CvRepository.getSavedByCurrentUser(currentProfile.profileType)
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
  
  const saveCv=(id: number) => {
    CvRepository.addCvToSaved(id, currentProfile.profileType)
    .then(res=> {
      setSavedCvs()
    })
  }

  const removeCvfromSaved = (id: number) => {
    CvRepository.removeCvFromSaved(id, currentProfile.profileType)
    .then(res=> {
      setSavedCvsState(state=> state.filter(el=> el.id !== id))
    })
  }

  const deleteCv = (id: number) => {
    CvRepository.deleteCV(id)
    .then(res=> {
      
      setSavedCvsState(state=> state.filter(el=> el.id !== id))
    })
  }

  const updateCv = (id: number, cv: ICV) => {
    
    CvRepository.updateCV(id, cv)
    .then(res=> {
      
      setSavedCvs()
    })
  }

  const editCv = (cv: ICV) => {
    createVcCvContext.setEditedCv(cv)
  }



  const value: IState = {
    ...defaultValue,
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
