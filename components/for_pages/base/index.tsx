import styles from './index.module.scss'

import { useEffect, useState } from 'react'
import Navigation from 'components/ui/Navigation'
import ContentBody from 'components/ui/Content/ContentBody'
import ContentAside from 'components/ui/Content/ContentAside'
import Content from 'components/ui/Content'
import SearchBar from 'components/ui/SearchBar'
import { useKnowledgeContext } from 'context/knowledge_state'
import BaseItems from './BaseItems'
import Spinner from 'components/ui/Spinner'
import { periods } from 'utils/commonObjects'
import { useAppContext } from 'context/state'
import TitleForSection from 'components/ui/TitleForSection'
import { useRouter } from 'next/navigation'
import useTranslation from 'next-translate/useTranslation'

export default function BasePage() {
  const {t} = useTranslation()
  const knowledgeContext = useKnowledgeContext()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const [page, pager] = useState<number>()
  const router = useRouter()

  const navSet = (()=>{
    return [...knowledgeContext.categories.values()].map(el=> {
      return {
        name: el.name,
        type: el.id,
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