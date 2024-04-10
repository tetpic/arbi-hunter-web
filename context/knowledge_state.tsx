import { ISearchBarReturnParams } from 'components/ui/SearchBar'
import { ICategory } from 'data/interfaces/Common'
import { IArticle } from 'data/interfaces/IArticle'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react'
import { CategoryType } from 'types/enums'

interface IState {
  categories: Map<number, ICategory>
  articlesByCategories: Map<number, IArticle[]>
  setKnowledgeBase: () => Promise<void>
  setSearchParams: Dispatch<SetStateAction<ISearchBarReturnParams>>
}

interface Props {
  children: React.ReactNode
}
const KnowledgeContext = createContext<Partial<IState>>({})

export function KnowledgeWrapper(props: Props) {
  const [categories, setCategoriesState] = useState<Map<number, ICategory>>(new Map)
  const [articlesByCategories, setArticlesState] = useState<Map<number, IArticle[]>>(new Map)
  const [searchParams, setSearchParams] = useState<ISearchBarReturnParams>(null)  

  const setKnowledgeBase = async () => {
    const categoriesRes = await ArticlesRepository.getCategoryList({categoryType: CategoryType.Knowledge, limit: 50, page: 1})
    setCategoriesState(state=> {
      categoriesRes.data.forEach(c=>{
        state.set(c.id, c)
      })
      return new Map(state)
    })
    if(searchParams) {
      setArticlesState(new Map)
    }
    const articleRes = await Promise.all(categoriesRes.data.map(c => {
      return ArticlesRepository.getNews({
        full: true,
        categories: [c.id], 
        articleType: CategoryType.Knowledge, 
        limit: 50, 
        page: 1, 
        isTop: false,
        forLastNumberOfDays: searchParams?.activePeriod,
        search: searchParams?.search
      })
    }))
    articleRes.forEach((articles) => {
      const data = articles.data
      if (data.length === 0) {
        return
      }
      setArticlesState(state=> {
        state.set(data[0].articleCategoryId, data)
        return new Map(state)
      })
    })
  }

  useEffect(()=>{
    if(searchParams) {
      setKnowledgeBase()
    }
  }, [searchParams])


  const value: IState = {
    categories,
    articlesByCategories,
    setKnowledgeBase,
    setSearchParams,
  }

  return (
    <KnowledgeContext.Provider value={value}>
      {props.children}
    </KnowledgeContext.Provider>
  )
}

export function useKnowledgeContext() {
  return useContext(KnowledgeContext)
}
