import MediaPageHeader from '../MediaHeader'
import styles from './index.module.scss'
import { ICategory } from 'data/interfaces/Common'
import MediaCategories from '../MediaCategories'
import MediaNewsSection from '../MediaNewsSection'
import { useUserContext } from 'context/user_state'
import ICommunity from 'data/interfaces/ICommunity'
import MediaCommunities from '../MediaCommunities'
import MediaCrypto from '../MediaCrypto'
import { IArticle } from 'data/interfaces/IArticle'
import MediaCompilation from '../MediaCompilation'
import SearchBar from 'components/ui/SearchBar'


interface Props {
  categories: ICategory[]  
  communities: ICommunity[]
  news: IArticle[]
  newsCompilations: ICategory[]

}

export default function MediaPage(props: Props) {
  const userContext = useUserContext()

  return (
    <div className={styles.root}>
      {!userContext.currentProfile &&
        <MediaPageHeader/>  
      }
      <SearchBar/>
      <MediaCategories categories={props.categories}/>
      <MediaNewsSection title='Популярное' news={props.news.slice(0, 4)}/>
      <MediaCommunities communities={props.communities}/>
      <MediaCompilation newsCompilations={props.newsCompilations}/>
      <MediaCrypto/>
    </div>
  )
}
