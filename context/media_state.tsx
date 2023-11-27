import { IArticle } from 'data/interfaces/IArticle'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import { createContext, useContext, useState } from 'react'
import { ICategory } from 'data/interfaces/Common'

export interface IMediaContextState {
  savedArticles: Map<number, IArticle>
  setSavedArticles: (p: number)=>Promise<boolean|{total: number}>
  likeArticle: (article: IArticle) => Promise<boolean>
  categories: Map<number, ICategory>
  setCategories: ()=>Promise<boolean>
  currentNews: Map<number, IArticle>
  setCurrentNews: (data: {articles?: IArticle[], clear?: boolean}) => void
  stories: Map<number, IArticle> 
  setStories: () => void
}

const MediaContext = createContext<Partial<IMediaContextState>>({})

interface Props {
  children: React.ReactNode
  categories?: Map<number, ICategory>
  savedArticles?: IArticle[]
}

export function MediaWrapper(props: Props) {
  const [savedArticles, setSavedArticlesState] = useState<Map<number, IArticle>>(new Map)
  const [categories, setCategoriesState] = useState<Map<number, ICategory>>()
  const [stories, setStoriesState] = useState<Map<number, IArticle>>(new Map)
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
    if(article.isLikedByCurrentProfile) {
      await ArticlesRepository.removeLikeFromArticle(article.id)
    }
    else if(!article.isLikedByCurrentProfile) {
      await ArticlesRepository.addLikeToArticle(article.id)
    }
    currentNews.size > 0 && setCurrentNewsState(state=> {
      return new Map(likeStateHandler(state, article, isLiked, currentLikes))
    })
    savedArticles.size > 0 && setSavedArticlesState(state=> {
      return new Map(likeStateHandler(state, article, isLiked, currentLikes))
    })
    return true
  }

  const setStories = (stories?: IArticle[]) => {
    if(stories) {
      setStoriesState(new Map(stories.map(el=> [el.id, el]) ))
    }
    ArticlesRepository.getStories()
    .then(res=> {
      setStoriesState(new Map(res.data.map(el=> [el.id, el]) ))
    })
  }

  const value: IMediaContextState = {
    setSavedArticles,
    savedArticles,
    likeArticle,
    categories,
    setCategories,
    currentNews,
    setCurrentNews,
    stories,
    setStories
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
