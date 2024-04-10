import Spinner from 'components/ui/Spinner'
import { useMediaContext } from 'context/media_state'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from './index.module.scss'
import NewsArticle from '@/components/ui/NewsArticle'
import { IArticle } from 'data/interfaces/IArticle'
import { IOptionList } from '@/components/ui/OptionsList'
import BookmarkFilledSvg from '@/components/svg/BookmarkFilledSvg'
import BookmarkEmptySvg from '@/components/svg/BookmarkEmptySvg'
import { useAppContext } from 'context/state'
import { SnackbarType } from 'types/enums'
import LinkSvg from '@/components/svg/LinkSvg'
import ShareSvg from '@/components/svg/ShareSvg'
import CloseEyeSvg from '@/components/svg/CloseEyeSvg'
import { copyToClipboard } from 'utils/helpers'
import P from '@/components/ui/P'



export default function SavedMedia() {

  const mediaContext = useMediaContext()
  const appContext = useAppContext()
  const [loaded, setLoaded] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)

  useEffect(()=>{
    mediaContext.setSavedArticles(page).then(res=> {
      if(typeof res === 'object') {
        setLoaded(true) 
        setTotal(res.total)
      }
    })
  }, [page])

  const getOptions = (article: IArticle):IOptionList[] => {
    return [
      {
        title: article.isSavedByCurrentProfile?'Убрать из избранного':'Добавить в избранное', 
        icon: article.isSavedByCurrentProfile?<BookmarkFilledSvg/>: <BookmarkEmptySvg/>,
        onClick: ()=>{
          mediaContext.saveOrRemoveArticle(article, 'saved')
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

  return (
  <div className={styles.root}> 
    <InfiniteScroll 
    className={styles.infinite}
    next={()=>setPage(p => p+1)} 
    hasMore={mediaContext.savedArticles.size < total}    
    loader={<Spinner size={24}/>}
    scrollableTarget='scrollable'
    dataLength={0}>
      {loaded&&mediaContext?.savedArticles && mediaContext?.savedArticles?.size > 0 &&
        [...mediaContext?.savedArticles?.values()].map(el=> {
          return <NewsArticle article={el} options={getOptions(el)}/>
        })
        ||
        loaded&&mediaContext.savedArticles.size === 0&&
        <P useThemeColor className={'empty'}>Нет добавленных медиа</P>
     }
    </InfiniteScroll>
  </div>)
}