import { IArticle } from 'data/interfaces/IArticle'
import ICommunity from 'data/interfaces/ICommunity'
import { IUserProfile } from 'data/interfaces/IUser'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import CommunitiesRepository from 'data/repositories/CommunitiesRepository'
import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'
import { useUserContext } from './user_state'

interface IState {
  savedArticles: Map<number, IArticle>
  setSavedArticles: (p: number)=>Promise<boolean|{total: number}>
  communities: Map<number, ICommunity>
  currentCommunity: ICommunity,
  setCurrentCommunity: Dispatch<SetStateAction<ICommunity>>
  setCommunities: (p: number) => Promise<boolean|{total: number}>
  communityNews: Map<number, IArticle>
  communityMembers: Map<number, IUserProfile>
  setCommunityMembers: (page: number) => Promise<boolean|{total: number}>
  getCommunityNews: (id: number) => Promise<boolean|{total: number}>
  communitySubsription: (id: number, isSubsribed: boolean) => Promise<boolean>
}

const MediaContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
}

export function MediaWrapper(props: Props) {
  const userContext = useUserContext()
  const profileType = userContext.currentProfile.profileType||null

  const [savedArticles, setSavedArticlesState] = useState<Map<number, IArticle>>(new Map)
  const [communities, setCommunitiesState] = useState<Map<number, ICommunity>>(new Map)
  const [communityNews, setCommunityNews] = useState<Map<number, IArticle>>(new Map)
  const [currentCommunity, setCurrentCommunity] = useState<ICommunity>()
  const [communityMembers, setCommunityMembersState] = useState<Map<number, IUserProfile>>(new Map)


  const setSavedArticles = async(page: number):Promise<boolean|{total: number}> => {
    return ArticlesRepository.getSavedByCurrentUser(userContext.currentProfile.profileType, page)
    .then(res=> {
      setSavedArticlesState(state=> {
        res.data.forEach(e=> {
          state.set(e.id, e)
        })
        return new Map(state)
      })
      return {total: res.total}
    })
    .catch(err=>false)
  }

  const setCommunityMembers =  (page: number): Promise<boolean|{total: number}> => {
    return CommunitiesRepository.getCommunityMembers(profileType, currentCommunity.id, page)
    .then(res=>{
      setCommunityMembersState(state=>{
        res.data.forEach(r=>{
          state.set(r.id, r)
        })
        return new Map(state)
      })
      return {total: res.total}
    })
    .catch(err=> {
      return false
    })
    
  }

  const getCommunityNews = async (page: number) => {
    return ArticlesRepository.getCommunityNewsList(profileType, currentCommunity.id, page)
    .then(res => {
      setCommunityNews(state=> {
        state.clear()
        res.data.forEach(r=> {
          state.set(r.id, r)
        })
        return new Map(state)
      })
      return {total: res.total}
    })
    .catch(err=> {
      return false
    })
  }

  const setCommunities = async (p: number) => {
    const res = await CommunitiesRepository.getCommunities(profileType, p)
    if (res) {
      setCommunitiesState(s => {
        res.data.forEach(e=> {
          s.set(e.id, e)
        })
        return new Map(s)
      })
      return {total: res.total}
    }
    else {
      return false
    }
  }
  
  const communitySubsription = async (id: number, isSubsribed: boolean):Promise<boolean> => {
    const changeState = (b: boolean) => {
      if(currentCommunity) {
        setCurrentCommunity(state=> {
          state.isSubscribedByCurrentProfile = !isSubsribed
          return {...state}
        })
      }
      else {
        setCommunitiesState(state=> {
          const comm = state.get(id)
          comm.isSubscribedByCurrentProfile = b
          state.set(id, comm)
          return new Map(state)
        })
      }
    }

    if(isSubsribed) {
      await CommunitiesRepository.unsubscribeCommunity(profileType, id)
      changeState(!isSubsribed)
      return true
    }
    else {
      await CommunitiesRepository.subscribeCommunity(profileType, id)
      changeState(!isSubsribed)
      return true
    }
  }

  const value: IState = {
    setSavedArticles,
    savedArticles,
    currentCommunity,
    setCurrentCommunity,
    communities,
    communityNews,
    getCommunityNews,
    setCommunityMembers,
    communityMembers,

    setCommunities,
    communitySubsription
  }

  return (
    <MediaContext.Provider value={value}>
      {props.children}
    </MediaContext.Provider>
  )
}

export function useMediaContext() {
  return useContext(MediaContext)
}
