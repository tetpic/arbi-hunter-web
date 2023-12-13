import styles from './index.module.scss'

import Button from 'components/ui/Button'
import SettingsThreeSlidersSvg from 'components/svg/SettingsThreeSlidersSvg'
import classNames from 'classnames'
import { useResize } from 'components/hooks/useResize'
import LoupeSvg from 'components/svg/LoupeSvg'
import { useAppContext } from 'context/state'
import { ModalType } from 'types/enums'
import { useState } from 'react'
import { ISearchFilterModalProps } from 'components/modals/SearchFilterModal'
import { ICategory } from 'data/interfaces/Common'

export interface ISearchBarReturnParams {
  activeCategories?: number[]
  activePeriod: number
  searchValue: string
}

interface Props {
  className?: string
  fullWidth?: boolean
  onChange?: (data: ISearchBarReturnParams)=>void
  placeholder?: string
  categories?: ICategory[]
  periods?: {name: string, value: number}[]
}

/**
 * @className ? string 
 * @fullWidth ? boolean
 * @onChange ?: (s: string)=>void
 * @placeholder ?: string
 */

export default function SearchBar(props: Props) {
  const {isTabletWidth} = useResize()
  const appContext = useAppContext()

  const [activeCategories, setActiveCategories] = useState<Map<number, ICategory>>(new Map())
  const [activePeriod, setActivePeriod] = useState<number>()
  const [searchValue, setSearchValue] = useState('')

  const setCategories = (data: ICategory[])=>{
    setActiveCategories(new Map(data.map(el=>[el.id, el])))
  
  }
  const setPeriod = (data: number)=>{
    setActivePeriod(data)
  }


  const openFilters = ()=>{
    appContext.showModal<ISearchFilterModalProps>(ModalType.SearchFilterModal, {
      categories: props.categories,
      periods: props.periods,
      setCategories: (data: ICategory[]) => {setCategories(data)},
      setPeriod: (data: number) => {setPeriod(data)},
      activeCategories: [...activeCategories.keys()],
      activePeriod
    })
  }

  const submit = ()=>{
    props.onChange({
      activeCategories: [...activeCategories.keys()],
      activePeriod,
      searchValue
    })    
  }


  return (
    <div className={styles.container}>
      <div className={classNames(styles.root, props.className, props.fullWidth&&styles.fullWidth)}>
        <input className={styles.input} value={searchValue} onChange={(e)=> setSearchValue(e.target.value)} type="text" placeholder={props.placeholder||'Поиск'} /> 
        {!isTabletWidth && <>
          <Button title='filter button' onClick={openFilters} className={styles.filterButton}><SettingsThreeSlidersSvg/></Button>
          <Button title='search button' onClick={submit} className={styles.button}>Найти</Button>
        </>
        ||
        <Button title='search button'><LoupeSvg/></Button>
      }
      </div>
    </div>
  )
}