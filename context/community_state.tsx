import { UpdateCommunityForm, ICategory, ICreateNews } from 'data/interfaces/Common'
import { IArticle } from 'data/interfaces/IArticle'
import ICommunity from 'data/interfaces/ICommunity'
import { IUserProfile } from 'data/interfaces/IUser'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import CommunitiesRepository from 'data/repositories/CommunitiesRepository'
import { useRouter } from 'next/navigation'
import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from 'react'
import { CategoryType, SnackbarType } from 'types/enums'
import { useAppContext } from './state'
import { useUserContext } from './user_state'
import { IPagination } from 'types/types'

interface IState {
  communities: Map<number, ICommunity>
  setCommunities: (p: number) => Promise<boolean|{total: number}>
  currentCommunity: ICommunity,
  setCurrentCommunity: Dispatch<SetStateAction<ICommunity>>
  communityNews: Map<number, IArticle>
  getCommunityNews: (page: number) => Promise<boolean|{total: number}>
  setCommunityNews: Dispatch<SetStateAction<Map<number, IArticle>>>
  communityMembers: Map<number, IUserProfile>
  setCommunityMembers: (page: number) => Promise<boolean|{total: number}>
  communitySubsription: (id: number, isSubsribed: boolean) => Promise<boolean>
  categories: ICategory[]
  createCommunity: (c: UpdateCommunityForm) => void
  updateCommunity: (data: UpdateCommunityForm) => Promise<boolean>
  myCommunity: ICommunity
  createNews:(data: ICreateNews, id?: number)=> Promise<boolean>
  removeNews: (id: number) => Promise<boolean>
  saveArticle: (id: number)=> Promise<boolean>
  searchCommunityMembers: (page: number, search: string)=> Promise<IPagination<IUserProfile>>
  setMyCommunity: ()=>void
}

const CommunityContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
}

export function CommunityWrapper(props: Props) {
  const userContext = useUserContext()
  const appContext = useAppContext()
  const profileType = userContext?.currentProfile?.profileType||null
  const router = useRouter()

  const [communities, setCommunitiesState] = useState<Map<number, ICommunity>>(new Map)
  const [communityNews, setCommunityNews] = useState<Map<number, IArticle>>(new Map())
  const [currentCommunity, setCurrentCommunity] = useState<ICommunity>()
  const [communityMembers, setCommunityMembersState] = useState<Map<number, IUserProfile>>(new Map)
  const [categories, setCategoriesState] = useState<ICategory[]>([])
  const [myCommunity, setMyCommunityState] = useState<ICommunity|null>(null)

  const setCommunityMembers = (page: number): Promise<boolean|{total: number}> => {
    // try {
    //   const res = await CommunitiesRepository.getCommunityMembers(currentCommunity.id, {page})
    //   
    //   if(res) {
    //     setCommunityMembersState(state => {
    //       // state.clear()
    //       res.data.forEach(r => {
    //         state.set(r.id, r)
    //       })
    //       return new Map(state)
    //     })
    //     return { total: res.total }
    //   }
    // } catch (err) {
    //   return false
    // }
    return CommunitiesRepository.getCommunityMembers(currentCommunity.id, {page})
    .then(res=> {
      if(res) {
        setCommunityMembersState(state => {
          // state.clear()
          res.data.forEach(r => {
            state.set(r.id, r)
          })
          return new Map(state)
        })
        return { total: res.total }
      }
    })
    .catch(err => {
      
      return false
    })
  }

  const searchCommunityMembers = async (page: number, search: string): Promise<IPagination<IUserProfile>> => {
    const res = await CommunitiesRepository.getCommunityMembers(currentCommunity.id, {page, search})
    return res
  }

  const getCommunityNews = useCallback(async (page: number) => {
    if(currentCommunity) {
      return ArticlesRepository.getCommunityNewsList(currentCommunity.id, page)
      .then(res => {
        setCommunityNews(state=> {
          if(page === 1) {
            state.clear()
          }
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
  }, [currentCommunity])

  const setCommunities = async (p: number) => {
    const res = await CommunitiesRepository.getCommunities(p)
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
      await CommunitiesRepository.unsubscribeCommunity(id)
      changeState(!isSubsribed)
      return true
    }
    else {
      await CommunitiesRepository.subscribeCommunity(id)
      changeState(!isSubsribed)
      return true
    }
  }

  const setCategories = () => {
    ArticlesRepository.getCategoryList({categoryType:CategoryType.News})
    .then(res=> {
      setCategoriesState(res.data)
    })
  }

  const createCommunity = (data: UpdateCommunityForm) => {
    CommunitiesRepository.createCommunity(data)
    .then(res=> {
      router.push('/media/community/'+ res.id)
      appContext.hideModal()

    })
  }

  const updateCommunity = async (data: UpdateCommunityForm):Promise<boolean> => {
    const res = await CommunitiesRepository.updateCommunity(currentCommunity.id, data)
    
    appContext.hideModal()
    setCurrentCommunity(_ => {return {...res} })
    return true
  }

  const setMyCommunity = useCallback(() =>{
    if(myCommunity !== null) {return}
    if(profileType) {
      CommunitiesRepository.myCommunity()
      .then(res=> {
        setMyCommunityState(res.data[0])
      })
    }
  }, [myCommunity])

  const createNews = async (data: ICreateNews, id?: number): Promise<boolean> => {
    if(id) {
      const res = await ArticlesRepository.editCommunityNews(data, id)
      setCommunityNews(state=> {
        state.set(id, res)
        return new Map(state)
      })
      appContext.showSnackbar('Элемент успешно изменен', SnackbarType.success)
      return true
    }
    else {
      const res = await ArticlesRepository.createNews(data)
      setCommunityNews(state=> {
        const oldState = [...state.entries()]
        return new Map([[res.id, res], ...oldState])
      })
      appContext.showSnackbar('Элемент успешно создан', SnackbarType.success)
      return true
    }
  }

  const removeNews = async (id: number): Promise<boolean> => {
    await ArticlesRepository.removeArticle(profileType, id)
    setCommunityNews(state => {
      state.delete(id)
      return new Map(state)
    })
    appContext.showSnackbar('Успешно удалено', SnackbarType.success)
    return true
  }

  const saveArticle = async (id: number): Promise<boolean> => {
    await ArticlesRepository.addArticleToSaved(id)
    setCommunityNews(state=> {
      const item = state.get(id)
      item.isSavedByCurrentProfile = !item.isSavedByCurrentProfile
      state.set(id, item)
      return new Map(state)
    })
    return true
  }

  useEffect(()=>{
    if(categories.length === 0 && userContext.currentProfile) {
      setCategories()
      // userContext.currentProfile.profileType === ProfileType.Hirer&&setMyCommunity()
    }
  }, [userContext.currentProfile])

  const value: IState = {
    communities,
    setCommunities,
    setMyCommunity, 
    currentCommunity,
    setCurrentCommunity,
    communityNews,
    setCommunityNews,
    getCommunityNews,
    communityMembers,
    setCommunityMembers,
    communitySubsription,
    categories,
    createCommunity,
    updateCommunity,
    myCommunity,
    createNews,
    removeNews,
    saveArticle,
    searchCommunityMembers
  }

  return (
    <CommunityContext.Provider value={value}>
      {props.children}
    </CommunityContext.Provider>
  )
}

export function useCommunityContext() {
  return useContext(CommunityContext)
}
