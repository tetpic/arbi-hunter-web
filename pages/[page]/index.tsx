import styles from './index.module.scss'

import HtmlText from 'components/ui/HtmlText'
import {IPage} from 'data/interfaces/IPage'
import {GetServerSideProps} from 'next'
import PagesRepository from 'data/repositories/PagesRepository'
import ContentLayout from '@/components/layout/ContentLayout'

interface Props {
  page: IPage
}

export default function PageItemPage(props: Props) {
  return (
  <ContentLayout withFooter>
    
    <HtmlText 
    className={styles.content}
    text={props.page.body}
    />
  </ContentLayout>
  )
}


export const getServerSideProps: GetServerSideProps = async (context ) => {
 if(context.query.page === 'index'){
   return {
     notFound: true
   }
 }
  const page = await PagesRepository.fetchBySlug(context.query.page as string)

  return {
    props: {
      page,
    } as Props,
    notFound: !page
  }
}
