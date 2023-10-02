import { IArticle } from 'data/interfaces/IArticle'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import { createContext, useContext, useState } from 'react'
import { useUserContext } from './user_state'

interface IState {
  savedArticles: Map<number, IArticle>
  setSavedArticles: (p: number)=>Promise<boolean|{total: number}>
  likeArticle: (article: IArticle) => Promise<boolean>
}

const MediaContext = createContext<Partial<IState>>({})

interface Props {
  children: React.ReactNode
}

export function MediaWrapper(props: Props) {
  const userContext = useUserContext()
  const profileType = userContext?.currentProfile?.profileType||null

  const [savedArticles, setSavedArticlesState] = useState<Map<number, IArticle>>(new Map)


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

  

  const likeArticle =(article: IArticle): Promise<boolean> => {
    
    if(article.isLikedByCurrentProfile) {
      return ArticlesRepository.removeLikeFromArticle(profileType, article.id)
      .then(res=> {
        
        return true
      })
    }
    else if(!article.isLikedByCurrentProfile) {
      return ArticlesRepository.addLikeToArticle(profileType, article.id)
      .then(res=> {
        
        return true
      })
    }
    
  }

  const value: IState = {
    setSavedArticles,
    savedArticles,
    likeArticle,
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
