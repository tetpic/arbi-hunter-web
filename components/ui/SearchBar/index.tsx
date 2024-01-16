import styles from './index.module.scss'

import Button from 'components/ui/Button'
import SettingsThreeSlidersSvg from 'components/svg/SettingsThreeSlidersSvg'
import classNames from 'classnames'
import { useResize } from 'components/hooks/useResize'
import LoupeSvg from 'components/svg/LoupeSvg'
import { useAppContext } from 'context/state'
import { ModalType } from 'types/enums'
import {  useState } from 'react'
import { ISearchFilterModalProps } from 'components/modals/SearchFilterModal'
import { ICategory } from 'data/interfaces/Common'

export interface ISearchBarReturnParams {
  activeCategories?: number[]
  activePeriod?: number
  search?: string
}

interface Props {
  className?: string
  fullWidth?: boolean
  onChange?: (data: ISearchBarReturnParams)=>void
  placeholder?: string
  categories?: ICategory[]
  periods?: {name: string, value: number}[]
  onFilterClick?: ()=>void
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
  const [search, setSearchValue] = useState('')

  const setCategories = (data: ICategory[])=>{
    setActiveCategories(new Map(data.map(el=>[el.id, el])))
  }

  const setPeriod = (data: number)=>{
    setActivePeriod(data)
  }

  const submit = (data?: {categories: ICategory[], period: number})=>{
    props.onChange&&props.onChange({
      activeCategories: data? data.categories?.map(el=> el.id)||[]:[...activeCategories.keys()],
      activePeriod: data? data.period||null:activePeriod,
      search
    })    
  }


  const openFilters = ()=>{
    if(props.onFilterClick) {
      props.onFilterClick()
      return
    }
    const options: ISearchFilterModalProps = {
      categories: props.categories,
      periods: props.periods,
      onSubmit: (data)=>{
        data?.categories&&setCategories(data?.categories)
        setPeriod(data?.period)
        submit(data)
      },
      activeCategories: [...activeCategories.keys()],
      activePeriod
    }
    if(isTabletWidth) {
      appContext.showBottomSheet<ISearchFilterModalProps>(ModalType.SearchFilterModal, options, 0.7)
      return
    }
    appContext.showModal<ISearchFilterModalProps>(ModalType.SearchFilterModal, options)
  }

  return (
    <div className={classNames(styles.container, props.fullWidth&&styles.container_wide)}>
      <div className={classNames(styles.root, props.className, props.fullWidth&&styles.fullWidth)}>
        <input onKeyDown={(e)=> e.key==='Enter' && submit()} className={styles.input} value={search} onChange={(e)=> setSearchValue(e.target.value)} type="text" placeholder={props.placeholder||'Поиск'} /> 
        {props.onFilterClick &&
        <Button 
        title='filter button' 
        onClick={openFilters} 
        className={classNames(styles.filterButton, (activeCategories.size>0||activePeriod)&&styles.filterButton_active)}>
          <SettingsThreeSlidersSvg/>
        </Button>
        }

        <Button 
        title='search button' 
        onClick={()=> submit()} 
        className={!isTabletWidth&&styles.button}>
          {isTabletWidth&&<LoupeSvg/>||'Найти'}
        </Button>
      </div>
    </div>
  )
}