import { useKnowledgeContext } from 'context/knowledge_state'
import styles from './index.module.scss'
import NewsArticle from 'components/ui/NewsArticle'
import ShareSvg from 'components/svg/ShareSvg'
import { IArticle } from 'data/interfaces/IArticle'
import { IOptionList } from 'components/ui/OptionsList'
import DocumentSvg from 'components/svg/DocumentSvg'
import { useAppContext } from 'context/state'
import { SnackbarType } from 'types/enums'
import BaseMobileItem from '../BaseMobileItem'
import { copyToClipboard } from 'utils/helpers'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  activeCategory: number
}

export default function BaseItems(props: Props) {
  const {t} = useTranslation()
  const knowledgeContext = useKnowledgeContext()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size

  const getOptions = (article: IArticle):IOptionList[] => {
    return [
      {title: t('knowledgeBase_shareLink'),icon: <ShareSvg/>, onClick: ()=>{
        copyToClipboard(process.env.host + '/media/article/' + article.id)
        appContext.showSnackbar(t('knowledgeBase_linkCopied'), SnackbarType.success)
      }},
    ]
  }

  return (<div className={styles.root}> 
    {!isTabletWidth && knowledgeContext.articlesByCategories.get(props.activeCategory)?.map(el=> {
      return (
        <NewsArticle icon={<DocumentSvg/>} article={el} disableLikes options={getOptions(el)}/>
      )
    })
    ||
    [...knowledgeContext.articlesByCategories.entries()].map(([id, articles])=> {
      return (
        <BaseMobileItem category={knowledgeContext.categories.get(id)} articles={articles}/>
      )
    })
    }
  </div>)
}