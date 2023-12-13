import styles from './index.module.scss'

import { ICategory } from 'data/interfaces/Common'
import { useEffect, useRef, useState } from 'react'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import Formatter from 'utils/formatter'
import InfiniteScroll from 'react-infinite-scroll-component'
import { colors } from 'styles/variables'
import Spinner from 'components/ui/Spinner'
import { useMediaContext } from 'context/media_state'
import SortArrowsSvg from 'components/svg/SortArrowsSvg'
import NewsArticle from 'components/ui/NewsArticle'
import classNames from 'classnames'
import { IOptionList } from 'components/ui/OptionsList'
import { IArticle } from 'data/interfaces/IArticle'
import BookmarkFilledSvg from 'components/svg/BookmarkFilledSvg'
import LinkSvg from 'components/svg/LinkSvg'
import ShareSvg from 'components/svg/ShareSvg'
import CloseEyeSvg from 'components/svg/CloseEyeSvg'
import BookmarkEmptySvg from 'components/svg/BookmarkEmptySvg'
import { SnackbarType } from 'types/enums'
import { useAppContext } from 'context/state'
import SearchBar, { ISearchBarReturnParams } from 'components/ui/SearchBar'
import { periods } from 'utils/commonObjects'

interface Props {
  category?: ICategory
  className?: string
  hideNav?: boolean
  children?: JSX.Element|JSX.Element[]
  scrollableTarget?: string
  categories?: ICategory[]

}

export default function NewsByCategories(props: Props) {
  const appContext = useAppContext()
  const mediaContext = useMediaContext()  
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>()
  const [loading, setLoading] = useState(true)
  const searchParams = useRef<ISearchBarReturnParams>(null)

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

  const refreshPage = (clear?: boolean) => {
    setLoading(true)
    let data: any = {
      isTop: false, 
      page: page, 
      limit: 10
    }
    if(searchParams.current){
      data = {
        ...data,
        search: searchParams.current.searchValue,
        categories: [searchParams.current.activeCategories],
        forLastNumberOfDays: searchParams.current.activePeriod
      }
    }
    if(props.category) {
      data.categories = [props.category.id]
    }
    ArticlesRepository.getNews(true, data)
    .then(res => {
      setTotal(res.total)
      mediaContext.setCurrentNews({articles: res.data, clear})
      setLoading(false)
    })
  }

  const search = (data: ISearchBarReturnParams) => {
    searchParams.current = data
    refreshPage(true)
  }




  
  useEffect(()=>{
    setPage(1)
    setTotal(null)
    mediaContext.setCurrentNews({clear: true})
  }, [props.category])

  useEffect(()=>{
    refreshPage()   
  }, [page, props.category])

  return (<>
    {!props.hideNav  &&
      <SearchBar 
      className={styles.searchBar} 
      placeholder='Найти статьи в выбранной категории' 
      categories={props.categories}
      periods={periods}
      onChange={(data)=> search(data)}
      />
    }
    {!props.hideNav && !loading &&
    <>
      <div className={styles.sort}>
        <p className={styles.found}>Найдено {total||0} {Formatter.pluralize(total, 'статья', 'статьи', 'статей')}</p>
        <p className={styles.sortBy}>Сортировать по <SortArrowsSvg/></p>
      </div>
    </>
    }


    <div className={classNames(styles.root, props.className)}> 
      {loading &&
        <Spinner size={24}/>
      }
      <InfiniteScroll 
      next={()=>setPage(p => p+1)} 
      hasMore={mediaContext.currentNews?.size < total} 
      loader={<Spinner size={24} color={colors.yellow}/>} 
      dataLength={mediaContext.currentNews?.size}
      scrollableTarget={props.scrollableTarget}
      >
        <div className={styles.children}>
          {props.children}
        </div>

        <div className='container'>
          {mediaContext.currentNews?.size > 0 && [...mediaContext.currentNews.values()].map(el=> {
          return (
            <NewsArticle key={el.id} options={getOptions(el)} article={el} titleName={props?.category?.name||el.community?.name||el.shortDescription}/>
            )
          })}
        </div>    
      </InfiniteScroll>
    </div>
  </>)
}