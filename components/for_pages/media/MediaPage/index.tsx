import MediaPageHeader from '../MediaHeader'
import MediaSearch from '../../../ui/MediaSearch'
import styles from './index.module.scss'
import { ICategory } from 'data/interfaces/Common'
import MediaCategories from '../MediaCategories'
import MediaNewsSection from '../MediaNewsSection'
import { useUserContext } from 'context/user_state'
import ICommunity from 'data/interfaces/ICommunity'
import MediaCommunities from '../MediaCommunities'
import MediaCrypto from '../MediaCrypto'
import { IArticle } from 'data/interfaces/IArticle'


interface Props {
  categories: ICategory[]  
  communities: ICommunity[]
  news: IArticle[]
}

export default function MediaPage(props: Props) {
  const userContext = useUserContext()

  return (
    <div className={styles.root}>
      {!userContext.currentProfile &&
        <MediaPageHeader/>  
      }
      <MediaSearch/>
      <MediaCategories categories={props.categories.filter(el=>el.image)}/>
      <MediaNewsSection title='Популярное' news={props.news.slice(4, 9)}/>
      <MediaCommunities communities={props.communities}/>
      <MediaNewsSection title='Новости' news={props.news} link={'/news'}/>
      <MediaCrypto/>
    </div>
  )
}
