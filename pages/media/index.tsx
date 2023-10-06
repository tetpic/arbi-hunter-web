import MediaPage from 'components/for_pages/media/MediaPage'
import { ICategory } from 'data/interfaces/Common'
import { IArticle } from 'data/interfaces/IArticle'
import ICommunity from 'data/interfaces/ICommunity'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import CommunitiesRepository from 'data/repositories/CommunitiesRepository'
import Head from 'next/head'
import { CookiesType } from 'types/enums'

interface Props {
  categories: ICategory[]
  communities: ICommunity[]
  news: IArticle[]
}

export const getServerSideProps = (async (context: { req: { cookies: { [x: string]: any } } }) => {
  const profileType = context.req.cookies[CookiesType.profileType]
  const token = context.req.cookies[CookiesType.accessToken]
  if(!profileType || !token) {
    return {
      redirect: {destination: '/login', permanent: false}   
    }
  }
  else {
    const categories = await ArticlesRepository.getCategoryList(profileType, null, 1, 10 )
    const communities = await CommunitiesRepository.getCommunities(profileType, 1)
    const news = await ArticlesRepository.getNews(profileType, token)
    return {props: {categories: categories.data, communities: communities.data, news: news.data}}
  }
}) 


export default function Media(props: Props) {

  return (<>
  <Head>
    <title>{'Arbi Hunter|Медиа'}</title>
    <meta name='description' content={'Медиа'}/>
  </Head>
  <MediaPage categories={props.categories} communities={props.communities} news={props.news}/>
  </>
  )
}