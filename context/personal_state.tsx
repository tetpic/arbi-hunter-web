import { IFile } from 'data/interfaces/Common'
import { IPersonalPage, IPersonalPageBlock } from 'data/interfaces/IPersonal'
import { IUserProfile } from 'data/interfaces/IUser'
import PersonalRepository from 'data/repositories/PersonalRepository'
import UserRepository from 'data/repositories/UserRepository'
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react'
import { useUserContext } from './user_state'

interface IState {
  setPersonalPage: (id?: number) => void
  personalPage: IPersonalPage
  updatePersonalPage: (data?: Partial<IPersonalPageBlock[]>) => Promise<IPersonalPage>
  blocks: Map<number, {block: IPersonalPageBlock, assets: IFile[]}>
  setBlocks: Dispatch<SetStateAction<Map<number, {block: IPersonalPageBlock, assets: IFile[]}>>>
  currentProfile: IUserProfile
}

const PersonalContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
}

export function PersonalWrapper(props: Props) {
  const userContext = useUserContext()
  const [personalPage, setPersonalPageState] = useState<IPersonalPage>(null)
  const [blocks, setBlocks] = useState<Map<number, {block: IPersonalPageBlock, assets: IFile[]}>>(new Map)
  const [currentProfile, setCurrentProfile] = useState<IUserProfile>(null) 

  const setPersonalPage = async (id?: number) => {
    if(id) {
      const profile = await UserRepository.getUserProfileById(id)
      setCurrentProfile(profile)
    }
    else {
      setCurrentProfile(userContext?.currentProfile)
    }
    try {
      const res = id?await PersonalRepository.getPersonalPageById(id):await PersonalRepository.getPersonalPage()
      setPersonalPageState(res)
      res.blocks.forEach(block => {
        const assets = res.assets.filter(el=> block.assets.includes(el.id))
        setBlocks(state=> state.set(block.order, {block, assets}))
      })
    }
    catch (err) {
      setPersonalPageState(undefined)
    }
  }

  const updatePersonalPage = async (): Promise<IPersonalPage> => {
    const orderedBlocks = [...blocks.values()].map((el, index)=> ({...el.block, order: index+1}))
    if(personalPage === undefined) {
      return PersonalRepository.createPersonalPage(orderedBlocks)
      .then(res=> {
        setPersonalPageState(res)
        return res
      })
    }
    else {
      return PersonalRepository.updatePersonalPage(personalPage?.id , orderedBlocks)
      .then(res=> {
        setPersonalPageState(res)
        return res
      })
      .catch(_=> {
        return null
      })
    }
  }


  const value: IState = {
    personalPage,
    setPersonalPage,
    updatePersonalPage,
    blocks, 
    setBlocks, 
    currentProfile
  }

  return (
    <PersonalContext.Provider value={value}>
      {props.children}
    </PersonalContext.Provider>
  )
}

export function usePersonalContext() {
  return useContext(PersonalContext)
}
