import styles from './index.module.scss'

import { useEffect, useState } from 'react'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import { IArticle } from 'data/interfaces/IArticle'
import NewsArticle from 'components/ui/NewsArticle'
import InfiniteScroll from 'react-infinite-scroll-component'
import Spinner from 'components/ui/Spinner'
import { colors } from 'styles/variables'
import { IOptionList } from 'components/ui/OptionsList'
import BookmarkFilledSvg from 'components/svg/BookmarkFilledSvg'
import BookmarkEmptySvg from 'components/svg/BookmarkEmptySvg'
import LinkSvg from 'components/svg/LinkSvg'
import ShareSvg from 'components/svg/ShareSvg'
import CloseEyeSvg from 'components/svg/CloseEyeSvg'
import useAbortController from 'components/hooks/useAbortController'
import { useAppContext } from 'context/state'
import { SnackbarType } from 'types/enums'

interface Props {
}

export default function Subscriptions(props: Props) {
  const [news, setNews] = useState<Map<number, IArticle>>(new Map)
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>()
  const appContext = useAppContext()
  const {getNewSignal} = useAbortController()


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

  const getOptions = (article: IArticle):IOptionList[] => {
    return [
      {
        title: article.isSavedByCurrentProfile?'Убрать из избранного':'Добавить в избранное', 
        icon: article.isSavedByCurrentProfile?<BookmarkFilledSvg/>: <BookmarkEmptySvg/>,
        onClick: ()=>{
          const signal = getNewSignal()
          if(article.isSavedByCurrentProfile) {
            ArticlesRepository.removeArticleFromSaved(article.id, {signal})
            .then(_=> {
              setNews(state=> {
                const item = state.get(article.id)
                item.isSavedByCurrentProfile = false
                state.set(article.id, item)
                return new Map(state)
              })    
            })
            .catch(_=> {
              appContext.showSnackbar('Вы быстрее интернета', SnackbarType.error)
            })
          }
          else {
            ArticlesRepository.addArticleToSaved(article.id, {signal})
            .then(_=> {
              setNews(state=> {
                const item = state.get(article.id)
                item.isSavedByCurrentProfile = true
                state.set(article.id, item)
                return new Map(state)
              })    
            })
            .catch(_=> {
              appContext.showSnackbar('Вы быстрее интернета', SnackbarType.error)
            })
          }
        }        
      },
      {title: 'Скопировать ссылку',icon: <LinkSvg/>,},
      {title: 'Поделиться',icon: <ShareSvg/>},
      {title: 'Скрыть',icon: <CloseEyeSvg/>}
    ]
  }

  return (<div className={styles.root}> 
  <InfiniteScroll 
  next={()=>setPage(p => p+1)} 
  hasMore={news.size < total} 
  loader={<Spinner size={32} color={colors.yellow}/>} 
  scrollableTarget={'scrollable'}
  style={{overflow: 'unset'}}
  dataLength={news.size}>

  {news && news.size > 0 &&
    [...news.values()].map(n=> 
      <NewsArticle 
      article={n} 
      options={getOptions(n)} 
      titleName={n.community.name} 
      titleImg={n.community?.image?.source} 
      withDefaultIcon/>
    )
  } 
  </InfiniteScroll>
  </div>)
}