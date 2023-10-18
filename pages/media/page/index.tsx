import { CategoryType, CookiesType } from 'types/enums'
import CommunitiesPage from 'components/for_pages/communities'
import ContentLayout from 'components/layout/ContentLayout'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import { ICategory } from 'data/interfaces/Common'

interface Query {
  category?: number
  categories? :ICategory[]
  page?: 'communities'|'categories'
}

interface Props extends Query{
}

export const getServerSideProps = (async (context: {query: Query, req: { cookies: { [x: string]: any } } }) => {
    const category = context.query?.category||null
    const page = context.query?.page||null
    const profileType = context.req.cookies[CookiesType.profileType]
    const token = context.req.cookies[CookiesType.accessToken]
    if(!profileType || !token) {
      return {
        redirect: {destination: '/login', permanent: false}   
      }
    }
    else {
      const categories = await ArticlesRepository.getCategoryList({categoryType: CategoryType.News, page: 1, limit: 20})
      return {props: {category: category, categories: categories.data, page: page}}
    }
  }) 

export default function Communities(props: Props) {
  return (
    <ContentLayout>
      <CommunitiesPage categories={props.categories} category={props.category} page={props.page}/>
    </ContentLayout>
  )
}