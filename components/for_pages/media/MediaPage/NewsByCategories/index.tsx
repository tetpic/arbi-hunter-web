import SearchBar, { ISearchBarReturnParams } from 'components/ui/SearchBar'
import styles from './index.module.scss'
import NewsList from '../NewsList'
import { ICategory } from 'data/interfaces/Common'
import { useMediaContext } from 'context/media_state'
import { periods } from 'utils/commonObjects'
import { useEffect } from 'react'
import Spacer from 'components/ui/Spacer'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  category: ICategory
}

export default function NewsByCategories(props: Props) {
  const mediaContext = useMediaContext()
  const {t} = useTranslation()

  useEffect(()=>{
    mediaContext.setSearchParams({activeCategories: [props.category.id]})
  }, [props.category])

  const search = (data: ISearchBarReturnParams) => {
    mediaContext.setSearchParams(state=> ({...state, activePeriod: data.activePeriod, searchValue: data.search}))
  }

  return (<>
    <SearchBar 
    className={styles.searchBar} 
    placeholder={t('media_article_findArticles')} 
    periods={periods}
    onSubmit={search}
    />
    <Spacer basis={24}/>
    <NewsList key={'news by category'} category={props.category} categories={[props.category.id]}/>
  </>)
}