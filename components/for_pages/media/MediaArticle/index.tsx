import styles from './index.module.scss'

import NewsArticle from 'components/ui/NewsArticle'
import { IArticle } from 'data/interfaces/IArticle'
import { useAppContext } from 'context/state'
import { useMediaContext } from 'context/media_state'
import { IOptionList } from 'components/ui/OptionsList'
import BookmarkFilledSvg from 'components/svg/BookmarkFilledSvg'
import BookmarkEmptySvg from 'components/svg/BookmarkEmptySvg'
import { CategoryType, SnackbarType } from 'types/enums'
import LinkSvg from 'components/svg/LinkSvg'
import ShareSvg from 'components/svg/ShareSvg'
import CloseEyeSvg from 'components/svg/CloseEyeSvg'
import { useEffect } from 'react'
import { copyToClipboard, shareData } from 'utils/helpers'
import Title from '@/components/ui/TitleForSection'
import { useRouter } from 'next/navigation'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  article: IArticle
}

export default function MediaArticle(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const mediaContext = useMediaContext()
  const router = useRouter()

  useEffect(()=>{
    mediaContext.setCurrentNews({articles: [props.article], clear: true})
  }, [])

  const getOptions = (article: IArticle):IOptionList[] => {
    const arr = [
      {
        title: article.isSavedByCurrentProfile?t('media_article_removeFromFavorite'):t('media_article_addToFavorite'), 
        icon: article.isSavedByCurrentProfile?<BookmarkFilledSvg/>: <BookmarkEmptySvg/>,
        onClick: ()=>{
          mediaContext.saveOrRemoveArticle(article)
          .then(_=>appContext.showSnackbar(t('media_article_success'), SnackbarType.success))
        }        
      },
      {title: t('media_article_copyLink'),icon: <LinkSvg/>, onClick: ()=>{
        copyToClipboard(process.env.host + '/media/article/' + article.id)
        appContext.showSnackbar(t('media_article_linkCopied'), SnackbarType.success)
      }},
      navigator.share&&{title: t('media_article_share'),icon: <ShareSvg/>, onClick: ()=>{
        shareData({url: process.env.host + '/media/article/' + article.id})
      }},
      (props.article?.articleCategory?.categoryType !== CategoryType.Knowledge&&{title: t('media_article_hide'),icon: <CloseEyeSvg/>})
    ]
    return arr.filter(Boolean)
  }

  return (<>
    {isTabletWidth && <Title title={' '} onBackClick={router.back} className={styles.title}/>}
    {
      mediaContext.currentNews&&mediaContext.currentNews.size > 0 &&
      <NewsArticle 
      className={styles.article}
      article={mediaContext.currentNews.get(props.article.id)} 
      titleName={props.article?.community?.name} 
      isOpen 
      options={getOptions(mediaContext.currentNews.get(props.article.id))}
      titleImg={props.article.community?.image} 
      disableLikes={props.article?.articleCategory?.categoryType === CategoryType.Knowledge}
      />
    }  
  </>)
}