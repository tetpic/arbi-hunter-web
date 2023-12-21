import styles from './index.module.scss'

import { ICategory } from 'data/interfaces/Common'
import { useEffect } from 'react'
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
import copyToClipboard from 'utils/copyToClipboard'

interface Props {
  className?: string
  hideNav?: boolean
  children?: JSX.Element|JSX.Element[]
  scrollableTarget?: string
  categories?: number[]
  category?: ICategory
}

export default function NewsList(props: Props) {
  const appContext = useAppContext()
  const mediaContext = useMediaContext() 
  const categories = props.categories

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
      {title: 'Скопировать ссылку',icon: <LinkSvg/>, onClick: ()=>{
        copyToClipboard(process.env.host + '/media/article/' + article.id)
        appContext.showSnackbar('Ссылка скопирована', SnackbarType.success)
      }},
      {title: 'Поделиться',icon: <ShareSvg/>},
      {title: 'Скрыть',icon: <CloseEyeSvg/>}
    ]
  }

  // useEffect(()=>{
  //   setPage(1)
  //   setTotal(null)
  //   mediaContext.setCurrentNews({clear: true})
  // }, [props.category])

  useEffect(()=>{
    mediaContext.refreshPage({categories})   
  }, [mediaContext.page])

  useEffect(()=>{
    mediaContext.refreshPage({categories, page: 1})   
  }, [props.category])



  return (<>
    {!props.hideNav && !mediaContext.loading &&
    <>
      <div className={styles.sort}>
        <p className={styles.found}>Найдено {mediaContext.total||0} {Formatter.pluralize(mediaContext.total, 'статья', 'статьи', 'статей')}</p>
        <p className={styles.sortBy}>Сортировать по <SortArrowsSvg/></p>
      </div>
    </>
    }
    <div className={classNames(styles.root, props.className)}> 
      {mediaContext.loading &&
        <Spinner size={24}/>
      }
      <InfiniteScroll 
      next={()=>mediaContext.setPage(p => p+1)} 
      hasMore={mediaContext.currentNews?.size < mediaContext.total} 
      loader={<Spinner size={24} color={colors.yellow}/>} 
      dataLength={mediaContext.currentNews?.size}
      scrollableTarget={props.scrollableTarget}
      >
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