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
import { useMediaContext } from 'context/media_state'
import { SnackbarType } from 'types/enums'
import { useAppContext } from 'context/state'
import LinkSvg from 'components/svg/LinkSvg'
import ShareSvg from 'components/svg/ShareSvg'
import CloseEyeSvg from 'components/svg/CloseEyeSvg'

interface Props {
}

export default function Subscriptions(props: Props) {
  const [news, setNews] = useState<Map<number, IArticle>>(new Map)
  const mediaContext = useMediaContext()
  const appContext = useAppContext()
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

  const getOptions = (article: IArticle):IOptionList[] => {
    return [
      {
        title: article.isSavedByCurrentProfile?'Убрать из избранного':'Добавить в избранное', 
        icon: article.isSavedByCurrentProfile?<BookmarkFilledSvg/>: <BookmarkEmptySvg/>,
        onClick: ()=>{
          mediaContext.saveOrRemoveArticle(article)
          .then(_=>appContext.showSnackbar('Успешно', SnackbarType.success))
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
  dataLength={news.size}>

  {news && news.size > 0 &&
    [...news.values()].map(n=> <NewsArticle article={n} titleName={n.community.name} titleImg={n.community?.image?.source} withDefaultIcon/>)
  } 
  </InfiniteScroll>
  </div>)
}