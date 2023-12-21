import styles from './index.module.scss'

import NewsArticle from 'components/ui/NewsArticle'
import { IArticle } from 'data/interfaces/IArticle'
import { useAppContext } from 'context/state'
import { useMediaContext } from 'context/media_state'
import { IOptionList } from 'components/ui/OptionsList'
import BookmarkFilledSvg from 'components/svg/BookmarkFilledSvg'
import BookmarkEmptySvg from 'components/svg/BookmarkEmptySvg'
import { SnackbarType } from 'types/enums'
import LinkSvg from 'components/svg/LinkSvg'
import ShareSvg from 'components/svg/ShareSvg'
import CloseEyeSvg from 'components/svg/CloseEyeSvg'
import { useEffect } from 'react'
import copyToClipboard from 'utils/copyToClipboard'

interface Props {
  article: IArticle
}

export default function MediaArticle(props: Props) {
  const appContext = useAppContext()
  const mediaContext = useMediaContext()

  useEffect(()=>{
    mediaContext.setCurrentNews({articles: [props.article], clear: true})
  }, [])

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

  return (<>
    {
      mediaContext.currentNews&&mediaContext.currentNews.size > 0 &&
      <NewsArticle 
      className={styles.article}
      article={mediaContext.currentNews.get(props.article.id)} 
      titleName={props.article?.community?.name} 
      isOpen 
      options={getOptions(mediaContext.currentNews.get(props.article.id))}
      titleImg={props.article.community?.image?.source} 
      />
    }  
  </>)
}