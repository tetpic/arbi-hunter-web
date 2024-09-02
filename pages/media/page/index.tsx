import { CategoryType } from 'types/enums'
import MediaPage, { MediaPageNav } from 'components/for_pages/media/MediaPage'
import ContentLayout from 'components/layout/ContentLayout'
import ArticlesRepository from 'data/repositories/ArticlesRepository'
import { ICategory } from 'data/interfaces/Common'
import useTranslation from 'next-translate/useTranslation'

interface Query {
  category?: number
  categories? :ICategory[]
  page?: MediaPageNav
  isMobile?:boolean
}

interface Props extends Query{
}

export const getServerSideProps = (async (context: {query: Query, req: { cookies: { [x: string]: any } } }) => {
    const category = context.query?.category||null
    const page = context.query?.page||null
    const categories = await ArticlesRepository.getCategoryList({categoryType: CategoryType.News, page: 1, limit: 20})
    return {props: {category: category, categories: categories.data, page: page,}}
  }) 

export default function Communities(props: Props) {
  const {t} = useTranslation()
  return (
    <ContentLayout hideMobileHeader title={t('media')}>
        <MediaPage categories={props.categories} isMobile={props.isMobile} category={props.category} page={props.page}/>
    </ContentLayout>
  )
}