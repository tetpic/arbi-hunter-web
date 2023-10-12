import MediaPage from 'components/for_pages/media/MediaPage'
import { ICategory } from 'data/interfaces/Common'
import { IArticle } from 'data/interfaces/IArticle'
import ICommunity from 'data/interfaces/ICommunity'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import CommunitiesRepository from 'data/repositories/CommunitiesRepository'
import Head from 'next/head'
import { CategoryType } from 'types/enums'

interface Props {
  categories: ICategory[]
  communities: ICommunity[]
  news: IArticle[]
  newsCompilations: ICategory[]
}

export const getServerSideProps = (async (context: { req: { cookies: { [x: string]: any } } }) => {
  const categories = await ArticlesRepository.getCategoryList(CategoryType.News, 1, 10)
  const communities = await CommunitiesRepository.getCommunities(1)
  const news = await ArticlesRepository.getNews(true)
  const newsCompilations = (await ArticlesRepository.getCategoryList(CategoryType.News, 1, 20)).data
  return {props: {categories: categories.data, communities: communities.data, news: news.data, newsCompilations}}
}) 


export default function Media(props: Props) {

  return (<>
  <Head>
    <title>{'Arbi Hunter|Медиа'}</title>
    <meta name='description' content={'Медиа'}/>
  </Head>
  <MediaPage categories={props.categories} communities={props.communities} news={props.news} newsCompilations={props.newsCompilations} />
  </>
  )
}