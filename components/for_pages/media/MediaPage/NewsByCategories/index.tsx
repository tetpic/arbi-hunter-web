import SearchBar, { ISearchBarReturnParams } from 'components/ui/SearchBar'
import styles from './index.module.scss'
import NewsList from '../NewsList'
import { ICategory } from 'data/interfaces/Common'
import { useMediaContext } from 'context/media_state'
import { periods } from 'utils/commonObjects'
import { useEffect } from 'react'
import Spacer from 'components/ui/Spacer'

interface Props {
  category: ICategory
}

export default function NewsByCategories(props: Props) {
  const mediaContext = useMediaContext()

  useEffect(()=>{
    mediaContext.setSearchParams({activeCategories: [props.category.id]})
  }, [props.category])

  const search = (data: ISearchBarReturnParams) => {
    mediaContext.setSearchParams(state=> ({...state, activePeriod: data.activePeriod, searchValue: data.searchValue}))
  }

  return (<>
    <SearchBar 
    className={styles.searchBar} 
    placeholder='Найти статьи в выбранной категории' 
    periods={periods}
    onChange={search}
    />
    <Spacer basis={24}/>
    <NewsList key={'news by category'} category={props.category} categories={[props.category.id]}/>
  </>)
}