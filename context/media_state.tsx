import { IArticle } from 'data/interfaces/IArticle'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import { createContext, useContext, useState } from 'react'
import { useUserContext } from './user_state'
import { ICategory } from 'data/interfaces/Common'

interface IState {
  savedArticles: Map<number, IArticle>
  setSavedArticles: (p: number)=>Promise<boolean|{total: number}>
  likeArticle: (article: IArticle) => Promise<boolean>
  categories: Map<number, ICategory>
  setCategories: ()=>Promise<boolean>
  currentNews: Map<number, IArticle>
  setCurrentNews: (data: {articles?: IArticle[], clear?: boolean}) => void
}

const MediaContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
  categories?: Map<number, ICategory>
}

export function MediaWrapper(props: Props) {
  const userContext = useUserContext()
  const profileType = userContext?.currentProfile?.profileType||null

  const [savedArticles, setSavedArticlesState] = useState<Map<number, IArticle>>(new Map)
  const [categories, setCategoriesState] = useState<Map<number, ICategory>>()

  const [currentNews, setCurrentNewsState] = useState<Map<number, IArticle>>(new Map)

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

  const setCategories = async ():Promise<boolean> => {
    const res = await ArticlesRepository.getCategoryList()
    setCategoriesState(state=> {
      res.data.forEach(r=>{
        state.set(r.id, r)
      })
      return state
    } )
    return true
  }

  const likeArticle =async (article: IArticle, type?: 'current'|'saved'): Promise<boolean> => {
    /* TODO: LIKES */
    if(article.isLikedByCurrentProfile) {
      await ArticlesRepository.removeLikeFromArticle(profileType, article.id)
      return false
    }
    else if(!article.isLikedByCurrentProfile) {
      await ArticlesRepository.addLikeToArticle(profileType, article.id)
      return true
    }
  }

  const value: IState = {
    setSavedArticles,
    savedArticles,
    likeArticle,
    categories,
    setCategories,
    currentNews,
    setCurrentNews
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
