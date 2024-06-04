import styles from './index.module.scss'

import HtmlText from 'components/ui/HtmlText'
import PageLayout from 'components/layout/PageLayout'
import BackgroundsContainer from 'components/layout/BackgroundsContainer'
import BackgroundLogoSvg from 'components/svg/BackgroundLogoSvg'
import classNames from 'classnames'
import IPage from 'data/interfaces/IPage'
import {GetServerSideProps} from 'next'
import PagesRepository from 'data/repositories/PagesRepository'

interface Props {
  page: IPage
}

export default function PageItemPage(props: Props) {
  return (

          <HtmlText className={classNames({
            [styles.content]: true,
          })}>
            {props.page.body}
          </HtmlText>
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
