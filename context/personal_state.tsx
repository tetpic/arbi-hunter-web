import { IFile } from 'data/interfaces/Common'
import { IPersonalPage, IPersonalPageBlock } from 'data/interfaces/IPersonal'
import { IUserProfile } from 'data/interfaces/IUser'
import PersonalRepository from 'data/repositories/PersonalRepository'
import UserRepository from 'data/repositories/UserRepository'
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react'
import { useUserContext } from './user_state'
import { BackgroundCategoryType, IBackground } from 'data/interfaces/IBackground'
import BackgroundRepository from 'data/repositories/BackgroundsRepository'
import { ProfileType } from 'data/interfaces/IRegistration'

interface IState {
  setPersonalPage: (data?: {profileId?: number, profile?: IUserProfile}) => Promise<IUserProfile>
  personalPage: IPersonalPage
  updatePersonalPage: (data?: Partial<IPersonalPageBlock[]>) => Promise<IPersonalPage>
  blocks: Map<number, {block: IPersonalPageBlock, assets?: IFile[]}>
  setBlocks: Dispatch<SetStateAction<Map<number, {block: IPersonalPageBlock, assets?: IFile[], layout?: any}>>>
  currentProfile: IUserProfile,
  backgrounds: Map<number, IBackground>
  refreshBackgrounds: () => void
  weather: IBackground
  transport: IBackground
  loading: boolean  
  setBackgrounds: (profile: IUserProfile) => Promise<[] | IBackground[]>
  setCurrentProfile: Dispatch<SetStateAction<IUserProfile>>
}

const PersonalContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
  initialBacks?: IBackground[]
  profile?: IUserProfile
  personalPage?: IPersonalPage
}

export function PersonalWrapper(props: Props) {
  const userContext = useUserContext()
  const [personalPage, setPersonalPageState] = useState<IPersonalPage>(props.personalPage)
  const [blocks, setBlocks] = useState<Map<number, {block: IPersonalPageBlock, assets?: IFile[], layout?: any}>>(new Map)
  const [currentProfile, setCurrentProfile] = useState<IUserProfile>(props.profile) 
  const [backgrounds, setBackgroundsState] = useState<Map<BackgroundCategoryType, IBackground>>(new Map(props.initialBacks?.map(el=> [el.category?.id||null , el])))
  const [weather, setWeater] = useState<IBackground>()
  const [transport, setTransport] = useState<IBackground>()
  const [loading, setLoading] = useState(true)

  const setRives = async(backs: [] | IBackground[]) => {
    const weathersList = await BackgroundRepository.getBackground({categoryId: BackgroundCategoryType.Weather})
    const transportList = await BackgroundRepository.getBackground({categoryId: BackgroundCategoryType.Transport})
    const place = backs.find(el=> el.category?.id === BackgroundCategoryType.Places)
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

  const setBackgrounds =  async(profile: IUserProfile, _initialBacks?: IBackground[]): Promise<[] | IBackground[]> => {
    setLoading(true)
    const backs = _initialBacks||await BackgroundRepository.getBackground({profileId: profile?.id})

    profile?.profileType === ProfileType.Hirer && setRives(backs)

    setBackgroundsState(new Map(backs.map(el=> [el.category?.id||null , el])))
    
    setLoading(false)    
    return backs
  }


  const setPersonalPage = async (data?: {profileId?: number, profile?: IUserProfile}): Promise<IUserProfile> => {
    setLoading(true)
    let profile: IUserProfile
    if(data?.profileId) {
      profile = await UserRepository.getUserProfileById(data?.profileId)
      setCurrentProfile(profile)
    }
    else if(data?.profile) {
      profile = data?.profile
      setCurrentProfile(data?.profile)
    }
    else {
      profile = userContext?.currentProfile
      setCurrentProfile(userContext?.currentProfile)
    }
    try {
      const res = (data?.profile||data?.profileId)?
      await PersonalRepository.getPersonalPageById(data?.profile?.id||data?.profileId):
      await PersonalRepository.getPersonalPage()
      setPersonalPageState(res)
      if(res?.blocks) {
        res?.blocks.forEach(block => {
          const assets = res.assets.filter(el=> block.assets.includes(el.id))
          setBlocks(state=> state.set(block.order, {block, assets}))
        })
      }
    }
    catch (err) {
      setPersonalPageState(undefined)
    }
    setLoading(false)
    return profile
  }

  const updatePersonalPage = async (): Promise<IPersonalPage> => {
    const orderedBlocks = [...blocks.values()].map((el, index)=> ({...el.block, order: index+1}))
    
    if(personalPage === undefined) {
      return PersonalRepository.createPersonalPage(orderedBlocks)
      .then(res=> {
        setPersonalPageState(res)
        return res
      })
      .catch(_ => {
        return null
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
    setBackgroundsState(new Map(backs.map(el=> [el.category.id, el])))
  }

  useEffect(()=>{
    if(props.initialBacks && props.profile) {
      setBackgrounds(props.profile, props.initialBacks)
    }
  }, [props.initialBacks, props.profile])

  useEffect(()=>{
    return ()=>{
      setCurrentProfile(null)
      setLoading(true)
      setPersonalPageState(undefined)
      setBackgroundsState(undefined)
    }
  }, [])


  const value: IState = {
    personalPage: props.personalPage||personalPage,
    setPersonalPage,
    updatePersonalPage,
    blocks, 
    setBlocks, 
    currentProfile: props.profile||currentProfile,
    backgrounds: props.initialBacks?new Map(props.initialBacks?.map(el=> [el.category?.id||null , el])):backgrounds,
    refreshBackgrounds,
    weather,
    transport,
    loading,
    setBackgrounds,
    setCurrentProfile
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
