import styles from './index.module.scss'

import { useEffect, useState } from 'react'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import { IArticle } from 'data/interfaces/IArticle'
import NewsArticle from 'components/ui/NewsArticle'
import InfiniteScroll from 'react-infinite-scroll-component'
import Spinner from 'components/ui/Spinner'
import { colors } from 'styles/variables'

interface Props {
}

export default function Subscriptions(props: Props) {
  const [news, setNews] = useState<Map<number, IArticle>>(new Map)
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>()

  useEffect(()=>{
    
    ArticlesRepository.getSubscriptions(page)
    .then(res=>{
      !total&&setTotal(res.total)
      setNews(state=> {
        res.data.forEach(r=> {
          state.set(r.id, r)
        })
        return new Map(state)
      })
    })
  
  }, [page])

  return (<div className={styles.root}> 
  <InfiniteScroll 
  next={()=>setPage(p => p+1)} 
  hasMore={news.size < total} 
  loader={<Spinner size={32} color={colors.yellow}/>} 
  scrollableTarget={'scrollable'}
  dataLength={news.size}>

  {news && news.size > 0 &&
    [...news.values()].map(n=> <NewsArticle article={n} titleName={n.community.name} titleImg={n.community?.image?.source} withDefaultIcon/>)
  } 
  </InfiniteScroll>
  </div>)
}