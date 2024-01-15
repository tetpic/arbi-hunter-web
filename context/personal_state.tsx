import { IFile } from 'data/interfaces/Common'
import { IPersonalPage, IPersonalPageBlock } from 'data/interfaces/IPersonal'
import { IUserProfile } from 'data/interfaces/IUser'
import PersonalRepository from 'data/repositories/PersonalRepository'
import UserRepository from 'data/repositories/UserRepository'
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react'
import { useUserContext } from './user_state'
import { BackgroundCategoryType, IBackground } from 'data/interfaces/IBackground'
import BackgroundRepository from 'data/repositories/BackgroundsRepository'

interface IState {
  setPersonalPage: (id?: number) => void
  personalPage: IPersonalPage
  updatePersonalPage: (data?: Partial<IPersonalPageBlock[]>) => Promise<IPersonalPage>
  blocks: Map<number, {block: IPersonalPageBlock, assets: IFile[]}>
  setBlocks: Dispatch<SetStateAction<Map<number, {block: IPersonalPageBlock, assets: IFile[]}>>>
  currentProfile: IUserProfile,
  backgrounds: Map<number, IBackground>
  refreshBackgrounds: () => void
  weather: IBackground
  transport: IBackground
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
  const [backgrounds, setBackgrounds] = useState<Map<BackgroundCategoryType, IBackground>>(new Map)
  const [weather, setWeater] = useState<IBackground>()
  const [transport, setTransport] = useState<IBackground>()

  const setRives = async(backs: [] | IBackground[]) => {
    const weathersList = await BackgroundRepository.getBackground({categoryId: BackgroundCategoryType.Weather})
    const transportList = await BackgroundRepository.getBackground({categoryId: BackgroundCategoryType.Transport})
    const place = backs.find(el=> el.category.id === BackgroundCategoryType.Places)
    setWeater(_=> {
      switch(place?.id) {
        case 6: return weathersList.find(el=> el.id === 20)
        case 7: return weathersList.find(el=> el.id === 18) 
        case 8: return weathersList.find(el=> el.id === 17) 
        case 9: return weathersList.find(el=> el.id === 19)     
      }
    })
    setTransport(_=> {
      switch(place?.id) {
        case 6: return transportList.find(el=> el.id === 16)
        case 7: return transportList.find(el=> el.id === 15)
        case 8: return transportList.find(el=> el.id === 13)
        case 9: return transportList.find(el=> el.id === 14)     
      }
    })

  }


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
      const backs = await BackgroundRepository.getBackground({profileId: id||res.profileId})
      setRives(backs)
      setPersonalPageState(res)
      if(res?.blocks) {
        res?.blocks.forEach(block => {
          const assets = res.assets.filter(el=> block.assets.includes(el.id))
          setBlocks(state=> state.set(block.order, {block, assets}))
        })
      }
      setBackgrounds(new Map(backs.map(el=> [el.category.id , el])))
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

  const refreshBackgrounds = async () => {
    const backs = await BackgroundRepository.getBackground({profileId: currentProfile?.id})
    setRives(backs)
    setBackgrounds(new Map(backs.map(el=> [el.category.id, el])))
  }


  const value: IState = {
    personalPage,
    setPersonalPage,
    updatePersonalPage,
    blocks, 
    setBlocks, 
    currentProfile,
    backgrounds,
    refreshBackgrounds,
    weather,
    transport
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
