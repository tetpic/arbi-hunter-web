import styles from './index.module.scss'


import ContentLayout from 'components/layout/ContentLayout'
import NewsArticle from 'components/ui/NewsArticle'
import Spinner from 'components/ui/Spinner'
import { MediaWrapper } from 'context/media_state'
import { IArticle } from 'data/interfaces/IArticle'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import { useEffect, useState } from 'react'
import { Languages } from 'types/enums'



interface Query {
  id: number

}

interface Props extends Query {
}

export const getServerSideProps = (async (context: {query: Query, req: { cookies: { [x: string]: any } } }) => {
  const id = Number(context.query.id)
  return {props: {id: id}}
}) 

export default function ArticlePage(props: Props) {
  const [loading, setLoading] = useState<boolean>(true)
  const [article, setArticle] = useState<IArticle>(null)

  useEffect(()=>{
    ArticlesRepository.getById(props.id, Languages.ru)
    .then(a=> {
      setArticle(a)
      setLoading(false)
    })
  }, [])

  return (
    <ContentLayout>
      <MediaWrapper>
        <div className={styles.root}>
        {loading && <Spinner size={34} />
        ||
        article && !loading && <NewsArticle article={article} isOpen />
        }
        </div>
      </MediaWrapper>
    </ContentLayout>
  )
}