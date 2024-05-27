import { useKnowledgeContext } from 'context/knowledge_state'
import styles from './index.module.scss'
import { useAppContext } from 'context/state'
import BaseMobileItem from '../BaseMobileItem'
import useTranslation from 'next-translate/useTranslation'
import classNames from 'classnames'

interface Props {
  activeCategory: number
  className?: string
}

export default function BaseItems(props: Props) {
  const {t} = useTranslation()
  const knowledgeContext = useKnowledgeContext()
  const appContext = useAppContext()


  return (<div className={classNames(styles.root, props.className)}> 
    {
    [...knowledgeContext.articlesByCategories.entries()].map(([id, articles])=> {
      return (
        <BaseMobileItem category={knowledgeContext.categories.get(id)} articles={articles}/>
      )
    })
    }
  </div>)
}