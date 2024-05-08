import styles from './index.module.scss'

import Stories from 'components/ui/Stories'
import MediaCategories from '../../../../ui/CategoriesList'
import { ICategory } from 'data/interfaces/Common'
import { useMediaContext } from 'context/media_state'
import NewsList from '../NewsList'
import { useEffect} from 'react'
import SearchBar, { ISearchBarReturnParams } from 'components/ui/SearchBar'
import { periods } from 'utils/commonObjects'
import Spacer from 'components/ui/Spacer'
import P from '@/components/ui/P'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  categories: ICategory[]
}

export default function MainMediaPage(props: Props) {
  
  const mediaContext = useMediaContext()
  const {t} = useTranslation()


  const body = (<>
   {mediaContext.stories.size > 0 &&
      <>
        <P styleType={['large', 'w600']} useThemeColor  className={styles.title}>{t('media_page_stories')}</P>
        <Stories stories={[...mediaContext.stories.values()]} />
      </>
    } 
    <P styleType={['large', 'w600']} useThemeColor className={styles.title}><span>{t('media_page_headings')}</span> <span>{t('media_page_allHeadings')}</span></P>
    <MediaCategories className={styles.mediaCategories} categories={props.categories} hideNav articlesCounter/>
  </>)

  const search = (data: ISearchBarReturnParams) => {
    const activeCategories = data.activeCategories?.length > 0?data.activeCategories : props.categories.map(el=>el.id)
    const dataToSend = {
      ...data, 
      activeCategories
    }
    mediaContext.setSearchParams(dataToSend) 
  }  

  useEffect(()=>{
    if(mediaContext.stories.size === 0) {
      mediaContext.setStories()
    }
  }, [])

  return (<>
    <SearchBar 
    className={styles.searchBar} 
    placeholder={t('media_page_findArticles')}
    categories={props.categories}
    periods={periods}
    onSubmit={search}
    />

    <div className={styles.root}> 
      {body}
      <Spacer basis={24}/>
      <NewsList 
      key={'mainMediaPage'}
      hideNav 
      className={styles.news} 
      scrollableTarget='scrollable'
      categories={mediaContext.searchParams?.activeCategories || props.categories.map(el=>el.id)}
      />
    </div>
  </>)
}