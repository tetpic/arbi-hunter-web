import { useMediaContext } from 'context/media_state'
import MediaPageHeader from '../MediaHeader'
import MediaSearch from '../MediaSearch'
import styles from './index.module.scss'
import { ICategory } from 'data/interfaces/Common'
import MediaCategories from '../MediaCategories'
import MediaNewsSection from '../MediaNewsSection'
import { useUserContext } from 'context/user_state'
import ICommunity from 'data/interfaces/ICommunity'
import MediaCommunities from '../MediaCommunities'


interface Props {
  categories: ICategory[]  
  communities: ICommunity[]
}

export default function MediaPage(props: Props) {
  const mediacontext = useMediaContext()
  const userContext = useUserContext()
  // const categories = mediacontext.categories || props.categories
  

  return (
    <div className={styles.root}>
      {!userContext.currentProfile &&
        <MediaPageHeader/>  
      }
      <MediaSearch/>
      <MediaCategories categories={props.categories.filter(el=>el.image)}/>
      <MediaNewsSection title='Популярное'/>
      <MediaCommunities communities={props.communities}/>
      <MediaNewsSection title='Новости'/>
    </div>
  )
}
