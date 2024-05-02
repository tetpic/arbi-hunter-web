import styles from './index.module.scss'

import MediaPageHeader from '../MediaHeader'
import { ICategory } from 'data/interfaces/Common'
import MediaCategories from '../../../ui/CategoriesList'
import MediaNewsSection from '../MediaNewsSection'
import { useUserContext } from 'context/user_state'
import ICommunity from 'data/interfaces/ICommunity'
import MediaCommunities from '../MediaCommunities'
import MediaCrypto from '../MediaCrypto'
import { IArticle } from 'data/interfaces/IArticle'
import MediaCompilation from '../MediaCompilation'
import SearchBar from 'components/ui/SearchBar'
import { useResize } from 'components/hooks/useResize'
import Image from 'next/image'
import Title from 'components/ui/TitleForSection'
import useTranslation from 'next-translate/useTranslation'



interface Props {
  categories: ICategory[]  
  communities: ICommunity[]
  news: IArticle[]
  newsCompilations: ICategory[]
  isMobile?: boolean
}

export default function MediaLanding(props: Props) {
  const userContext = useUserContext()
  const {t} = useTranslation()
  const {isTabletWidth} = useResize()

  return (
    <div className={styles.root}>
      {props.isMobile && <SearchBar/>}
      <MediaPageHeader isMobile={props.isMobile}/>  
      {!props.isMobile && <SearchBar/>}

      <Title 
      className={styles.title}
      title={isTabletWidth?t('media_page_categories'):t('media_page_categoriesAll')} 
      link={'/media/page?page=categories'}
      />
      <MediaCategories categories={props.categories} title={isTabletWidth&&t('media_page_categories')} articlesCounter/>

      <Title 
      className={styles.title}
      title={t('media_page_popular')} 
      link={'/media/page?page=allArticles'}
      />
      <MediaNewsSection news={props.news.slice(0, 4)}/>

      <Title 
      className={styles.title}
      title={t('media_page_communities')} 
      link={'/media/page?page=communities'}/>
      <MediaCommunities communities={props.communities}/>

      <Title 
      className={styles.title}
      emoji={!isTabletWidth && <Image src={'/icons/diamond.png'} alt={'diamond icon'} width={32} height={34}/>}
      title={isTabletWidth?t('media_page_compilations'):t('media_page_personalCompilations')} 
      link={'/media/page?page=categories'}
      />
      <MediaCompilation newsCompilations={props.newsCompilations}/>
      {!isTabletWidth && <MediaCrypto/>}
    </div>
  )
}
