import { IArticle } from 'data/interfaces/IArticle'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import { Dispatch,  SetStateAction, createContext, useContext,  useEffect,  useState } from 'react'
import { ICategory } from 'data/interfaces/Common'
import { CategoryType } from 'types/enums'
import useAbortController from 'components/hooks/useAbortController'
import { ISearchBarReturnParams } from 'components/ui/SearchBar'

export interface IMediaContextState {
  savedArticles: Map<number, IArticle>
  setSavedArticles: (p: number)=>Promise<boolean|{total: number}>
  likeArticle: (article: IArticle) => Promise<boolean>
  categories: Map<number, ICategory>
  setCategories: (data:{categoryType?: CategoryType, limit: number, page: number})=>Promise<boolean>
  currentNews: Map<number, IArticle>
  setCurrentNews: (data: {articles?: IArticle[], clear?: boolean}) => void
  stories: Map<number, IArticle> 
  setStories: (stories?: IArticle[], target?: 'course'|'news') => void
  saveOrRemoveArticle: (article: IArticle, type?: 'current'|'saved') => Promise<boolean>
  searchParams: ISearchBarReturnParams
  setSearchParams: Dispatch<SetStateAction<ISearchBarReturnParams>>  

  /**
   * if passed page - current news will be reseted
   * @args {categories?: number[], page?: number}
   */
  refreshPage: (args: {categories?: number[], page?: number})=> void

  page: number
  setPage: Dispatch<SetStateAction<number>>
  total: number
  setTotal: Dispatch<SetStateAction<number>>
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>

  id: number
  
}

const MediaContext = createContext<Partial<IMediaContextState>>({})

interface Props {
  children: React.ReactNode
  categories?: Map<number, ICategory>
  savedArticles?: IArticle[]
  id?: number
}

export function MediaWrapper(props: Props) {
  const [savedArticles, setSavedArticlesState] = useState<Map<number, IArticle>>(new Map)
  const [categories, setCategoriesState] = useState<Map<number, ICategory>>(new Map)
  const [stories, setStoriesState] = useState<Map<number, IArticle>>(new Map)
  const [currentNews, setCurrentNewsState] = useState<Map<number, IArticle>>(new Map)
  const [searchParams, setSearchParams] = useState<ISearchBarReturnParams>(null)
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>()
  const [loading, setLoading] = useState(true)

  const {getNewSignal} = useAbortController()

  const setCurrentNews = (data: {articles?: IArticle[], clear?: boolean}) => {
    setCurrentNewsState(state=> {
      if(data.clear) {
        state.clear()
      }
      data.articles&& data.articles.forEach(a=> {
        state.set(a.id, a)
      })
      return new Map(state)
    })
  }


  const refreshPage = (args: {categories?: number[], page?: number}) => {
    
    let data: any = {
      isTop: false, 
      page: args.page||page, 
      limit: 10
    }
    if(searchParams){
      data = {
        ...data,
        search: searchParams.search,
        categories: [searchParams.activeCategories],
        forLastNumberOfDays: searchParams.activePeriod
      }
    }
    args.categories&&(data.categories = args.categories)
    args.page&&setPage(args.page)
    
    ArticlesRepository.getNews({isTop: true, ...data})
    .then(res => {
      setCurrentNews({articles: res.data})
      setTotal(res.total)
      setCurrentNews({articles: res.data, clear: !!args.page})
      setLoading(false)
    })
  }



  const setSavedArticles = async(page: number):Promise<boolean|{total: number}> => {
    return ArticlesRepository.getSavedByCurrentUser({page, full: true})
    .then(res=> {
      setSavedArticlesState(state=> {
        res.data.forEach(e=> {
          state.set(e.id, e)
        })
        return new Map(state)
      })
      return {total: res.total}
    })
    .catch(_=>false)
  }

  const setCategories = async (data:{categoryType?: CategoryType, limit: number, page: number}):Promise<boolean> => {
    const res = await ArticlesRepository.getCategoryList(data)
    setCategoriesState(state=> {
      res.data.forEach(r=>{
        state.set(r.id, r)
      })
      return new Map(state)
    } )
    return true
  }

  const saveOrRemoveArticle = async (article: IArticle, type?: 'current'|'saved'): Promise<boolean> => {
    const setCurrent = (b: boolean) => {
      setCurrentNewsState(state=> {
        const a = state.get(article.id)
        a.isSavedByCurrentProfile = b
        return new Map(state)
      })
      return true
    }

    const setSaved = (b: boolean) => {
      setSavedArticlesState(state=> {
        state.delete(article.id)
        return new Map(state)
      })
    }


    if(article.isSavedByCurrentProfile) {
      await ArticlesRepository.removeArticleFromSaved(article.id)
      switch(type) {
        case 'current':
          setCurrent(false)
          break
        case 'saved':
          setSaved(false)
          break
        default:
          setCurrent(false)
      }
      return true
    }
    else {
      await ArticlesRepository.addArticleToSaved(article.id)
      setCurrentNewsState(state=> {
        const a = state.get(article.id)
        a.isSavedByCurrentProfile = true
        return new Map(state)
      })
      switch(type) {
        case 'current':
          setCurrent(true)
          break
        case 'saved':
          setSaved(true)
          break
        default:
          setCurrent(true)
      }
      return true
    }
  }

  const likeStateHandler = (state: Map<number, IArticle>, article: IArticle, isLiked: boolean, currentLikes: string): Map<number, IArticle> => {
    const item = state.get(article.id)
    if(isLiked) {
      item.likesCount = (Number(currentLikes) - 1).toString()
      item.isLikedByCurrentProfile = false
    }
    else if(!isLiked) {
      item.likesCount = (Number(currentLikes) + 1).toString()
      item.isLikedByCurrentProfile = true
    }
    state.set(item.id, item)
    return state
  }

  const likeArticle = async (article: IArticle, type?: 'current'|'saved'): Promise<boolean> => {
    const isLiked = article.isLikedByCurrentProfile
    const currentLikes = article.likesCount
    const [signal] = getNewSignal('likeArticle')
    if(article.isLikedByCurrentProfile) {
      try{
        await ArticlesRepository.removeLikeFromArticle(article.id, {signal})
      } catch(e) {}
    }
    else if(!article.isLikedByCurrentProfile) {
      try{
        await ArticlesRepository.addLikeToArticle(article.id, {signal})
      } catch(e) {}
    }
    currentNews.size > 0 && setCurrentNewsState(state=> {
      return new Map(likeStateHandler(state, article, isLiked, currentLikes))
    })
    savedArticles.size > 0 && setSavedArticlesState(state=> {
      return new Map(likeStateHandler(state, article, isLiked, currentLikes))
    })
    return true
  }

  const setStories = (stories?: IArticle[], target?: 'course'|'news') => {
    if(stories) {
      setStoriesState(new Map(stories.map(el=> [el.id, el]) ))
    }
    ArticlesRepository.getStories({sort: 'publishedAt,DESC', isTop: false, target})
    .then(res=> {
      setStoriesState(new Map(res.data.map(el=> [el.id, el]) ))
    })
  }

  useEffect(()=>{
    
    if(searchParams) {
      refreshPage({categories: searchParams.activeCategories, page: 1})
    }
  }, [searchParams])

  const value: IMediaContextState = {
    setSavedArticles,
    savedArticles,
    likeArticle,
    categories,
    setCategories,
    currentNews,
    setCurrentNews,
    stories,
    setStories,
    saveOrRemoveArticle,
    searchParams,
    setSearchParams,
    refreshPage,
    id: props.id,
    page,
    setPage,
    total,
    setTotal,
    loading,
    setLoading,
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
