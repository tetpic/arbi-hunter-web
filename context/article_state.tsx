import { IArticle } from 'data/interfaces/IArticle'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import { createContext, useContext, useState } from 'react'
import { useUserContext } from './user_state'

interface IState {
  savedArticles: Map<number, IArticle>
  setSavedArticles: (p: number)=>Promise<boolean|{total: number}>
}

const defaultValue: IState = {
  savedArticles: null,
  setSavedArticles: ()=>null
}

const ArticleContext = createContext<IState>(defaultValue)

interface Props {
  children: React.ReactNode
}

export function ArticleWrapper(props: Props) {
  const [savedArticles, setSavedArticlesState] = useState<Map<number, IArticle>>(new Map())

  const userContext = useUserContext()

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



  const value: IState = {
    ...defaultValue,
    setSavedArticles,
    savedArticles
  }

  return (
    <ArticleContext.Provider value={value}>
      {props.children}
    </ArticleContext.Provider>
  )
}

export function useArticleContext() {
  return useContext(ArticleContext)
}
