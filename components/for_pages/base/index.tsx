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

export default function BasePage() {
  const {t} = useTranslation()
  const knowledgeContext = useKnowledgeContext()
  const appContext = useAppContext()
  const [page, pager] = useState<number>()
  const router = useRouter()



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
        {page &&
          <BaseItems activeCategory={page} className={styles.items}/>
          ||
          <Spinner size={24} />
        }
      </ContentBody>
    </Content>
  
  )
}