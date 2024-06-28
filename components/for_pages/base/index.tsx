import styles from './index.module.scss'

import { useEffect, useState } from 'react'
import ContentBody from 'components/ui/Content/ContentBody'
import Content from 'components/ui/Content'
import { useKnowledgeContext } from 'context/knowledge_state'
import BaseItems from './BaseItems'
import Spinner from 'components/ui/Spinner'
import { useAppContext } from 'context/state'
import TitleForSection from 'components/ui/TitleForSection'
import { useRouter } from 'next/navigation'
import useTranslation from 'next-translate/useTranslation'
import SearchBar from '@/components/ui/SearchBar'
import { periods } from 'utils/commonObjects'
import ContentAside from '@/components/ui/Content/ContentAside'
import Navigation from '@/components/ui/Navigation'
import SubCategories from 'components/ui/SubNavigationSet'
import { IArticle } from 'data/interfaces/IArticle'



export default function BasePage() {
  const {t} = useTranslation()
  const knowledgeContext = useKnowledgeContext()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const [page, pager] = useState<number>()
  const router = useRouter()
  const [currentCategory, setCurrentCategory] = useState<IArticle>()


  const subCategories = (id: number) => {
    if(!knowledgeContext.articlesByCategories.get(id)?.length ) return <></>
    else {
      return <SubCategories 
      categories={knowledgeContext.articlesByCategories.get(id)} 
      currentCategory={currentCategory} 
      setCurrent={(e: IArticle) => {
        setCurrentCategory(e)
        router.push('/media/article/' + e.id)
      }} 
      />
    }
  } 

  const navSet = (()=>{
    return [...knowledgeContext.categories.values()].map(el=> {
      return {
        name: el.name,
        type: el.id,
        subSet: subCategories(el.id) || []
      }
    })
  })()

  useEffect(()=>{
    knowledgeContext.setKnowledgeBase()
  }, [])

  useEffect(()=>{
    if(knowledgeContext.articlesByCategories.size > 0) {
      pager([...knowledgeContext.categories.keys()][0])
    }
  }, [knowledgeContext.articlesByCategories])

  return (
    <Content className={styles.root}>
      <ContentBody className={styles.body}>
        <TitleForSection onBackClick={router.back} title={t('nav_knowlegdeBase')} className={styles.title}/>
        <SearchBar periods={periods} onSubmit={(params)=> knowledgeContext.setSearchParams(params)} placeholder={t('knowledgeBase_search')}/>
        {page &&
          <BaseItems activeCategory={page} />
          ||
          <Spinner size={24} />
        }
      </ContentBody>
      {!isTabletWidth &&
        <ContentAside>
          <Navigation rootClassName={styles.nav} setPage={(p)=> pager(p)} currentPage={page} navSet={navSet}/>
        </ContentAside>
      }
    </Content>
  
  )
}