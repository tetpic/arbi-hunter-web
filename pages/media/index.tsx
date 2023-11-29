import MediaLanding from 'components/for_pages/media/MediaLanding'
import ContentLayout from 'components/layout/ContentLayout'
import { ICategory } from 'data/interfaces/Common'
import { IArticle } from 'data/interfaces/IArticle'
import ICommunity from 'data/interfaces/ICommunity'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import CommunitiesRepository from 'data/repositories/CommunitiesRepository'
import { CategoryType, CookiesType } from 'types/enums'

interface Props {
  categories: ICategory[]
  communities: ICommunity[]
  news: IArticle[]
  newsCompilations: ICategory[]
  isMobile?: boolean
}

export const getServerSideProps = (async (context: { req: { cookies: { [x: string]: any } } }) => {
  const token = context.req.cookies[CookiesType.accessToken]
  const profile = context.req.cookies[CookiesType.profileType]
  const isAuth = token&&profile
  if(isAuth) {
    return {redirect: {destination: '/media/page/', permanent: false}}
  }
  const categories = await ArticlesRepository.getCategoryList({categoryType: CategoryType.News, page: 1, limit:20})
  const communities = await CommunitiesRepository.getCommunities(1)
  const news = await ArticlesRepository.getNews(true)
  const newsCompilations = (await ArticlesRepository.getCategoryList({categoryType: CategoryType.News, page: 1, limit: 20})).data
  return {props: {categories: categories.data, communities: communities.data, news: news.data, newsCompilations}}
}) 


export default function Media(props: Props) {
  return (
    <ContentLayout withFooter title={'Медиа'}>
      <MediaLanding isMobile={props.isMobile} categories={props.categories} communities={props.communities} news={props.news} newsCompilations={props.newsCompilations} />
    </ContentLayout>
  )
}