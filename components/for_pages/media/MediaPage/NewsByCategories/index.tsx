import { ICategory } from 'data/interfaces/Common'
import { useEffect, useState } from 'react'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import styles from './index.module.scss'

import Formatter from 'utils/formatter'
import InfiniteScroll from 'react-infinite-scroll-component'
import { colors } from 'styles/variables'
import Spinner from 'components/ui/Spinner'
import { useMediaContext } from 'context/media_state'
import SortArrowsSvg from 'components/svg/SortArrowsSvg'
import { useUserContext } from 'context/user_state'
import NewsArticle from 'components/ui/NewsArticle'
import classNames from 'classnames'

interface Props {
  category?: ICategory
  className?: string
  hideNav?: boolean
}

export default function NewsByCategories(props: Props) {
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>()
  const mediaContext = useMediaContext()
  
  const news = mediaContext.currentNews
  const userContext = useUserContext()

  
  useEffect(()=>{
    setPage(1)
    setTotal(null)
    mediaContext.setCurrentNews({clear: true})
  }, [props.category])

  useEffect(()=>{
    let data: any = {
      isTop: false, 
      page: page, 
      limit: 10
    }
    if(props.category) {
      data.categories = props.category.id
    }
    ArticlesRepository.getNews(true, data, userContext?.currentProfile?.profileType)
    .then(res => {
      setTotal(res.total)
      mediaContext.setCurrentNews({articles: res.data})
    })
  }, [page, props.category])

  return (<>
  {!props.hideNav && 
    <div className={styles.sort}>
      <p className={styles.found}>Найдено {total||0} {Formatter.pluralize(total, 'статья', 'статьи', 'статей')}</p>
      <p className={styles.sortBy}>Сортировать по <SortArrowsSvg/></p>
    </div>
  }
  <div className={classNames(styles.root, props.className)}> 
  <InfiniteScroll 
  next={()=>setPage(p => p+1)} 
  hasMore={news?.size < total} 
  loader={<Spinner size={24} color={colors.yellow}/>} 
  dataLength={news?.size}
  height={'100%'}
  >
    {news?.size > 0 && [...news.values()].map(el=> {
      return (
        <NewsArticle key={el.id} article={el} titleName={props?.category?.name||el.community?.name||el.shortDescription}/>
        )
      })}
    </InfiniteScroll>
  </div>
  </>)
}