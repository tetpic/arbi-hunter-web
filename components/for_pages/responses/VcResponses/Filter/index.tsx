import classnames from 'classnames'
import classNames from 'classnames'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import Accordeon from 'components/ui/Accordeon'
import RemovableItem from 'components/ui/RemovableItem'
import { useEffect, useState } from 'react'
import { EducationTypes, Genders, WorkExperience } from 'types/enums'
import { arrayFromEnum, TranslateEducationType, TranslateGenderType, TranslateWorkExperience } from 'utils/enumsTranslations'
import styles from './index.module.scss'



export enum FilterItems {
  Experience = 'experience',
  Age = 'age',
  Education = 'education',
  Gender = 'gender',
  New = 'onlyNew'
}



export interface FilterItem {
  // active: boolean, 
  type: FilterItems
  items?: string[], 
  translatedItems?: string[]
  translatedActiveItem?: string
  activeItem?: string|null
  translation: string
}

interface Props {
  filtersHandler?: (v: Map<FilterItem, FilterItem>)=> void
}

export default function ResponsesFilter(props: Props) {

  const [filters, setFilters] = useState<Map<FilterItems, FilterItem>>(new Map())
  const [activeFilter, setActiveFilter] = useState<FilterItem>()
  const [filterOptions, setFilterOptions] = useState<Map<FilterItem, FilterItem>>(new Map())

  const getItems = (p: FilterItems): FilterItem => {
    let arr:any[] = []
    switch(p) {
      case FilterItems.Age:
        arr = ['18 30', '30 40', '40 50', '50 100']
        return {type:p, items: arr, translatedItems: ['от 18 до 30 лет', 'от 30 до 40 лет', 'от 40 до 50 лет', 'больше 60 лет'], activeItem: null, translatedActiveItem: null,  translation: 'Возраст'}
      case FilterItems.Education:
        arr = arrayFromEnum(EducationTypes)
        return {type:p, items: arr, translatedItems: arr.map(el=>TranslateEducationType(el)), activeItem: null, translatedActiveItem: null, translation: 'Образование'}
      case FilterItems.Experience:
        arr = arrayFromEnum(WorkExperience)
        return { type:p, items: arr, translatedItems: arr.map(el=> TranslateWorkExperience(el)), activeItem: null, translatedActiveItem: null,  translation: 'Опыт'}
      case FilterItems.Gender:
        arr = arrayFromEnum(Genders)
        return { type:p, items: arr, translatedItems: arr.map(el=> TranslateGenderType(el)), activeItem: null, translatedActiveItem: null,  translation: 'Пол'}
      // case FilterItems.New:
      //   return {translation: 'Только новые'}
    }
  }

  const accordeonHandler = (value?: FilterItem) => {    
    setActiveFilter(activeFilter===value?null:value)
  }

  const filterOptionsHandler = (k: FilterItem, index: number) => {
    
    setFilterOptions(state=> {
      if(index === undefined) {
        state.delete(k)
        return new Map(state)
      }
      state.set(k, {...k, activeItem: k.items[index], translatedActiveItem: k.translatedItems[index]})
      return new Map(state)
    })
    setActiveFilter(null)
  }

  useEffect(()=>{
    filterOptions
    
    props.filtersHandler&&props.filtersHandler(filterOptions)
  }, [filterOptions])

  useEffect(()=>{
    Object.values(FilterItems).forEach(el => {
      setFilters(state=> {
        state.set(el, getItems(el))
        return new Map(state)
      })
    })
  }, [])

  return (<div className={styles.root}>
    <div className={styles.filterWrapper}>
      {[...filters.entries()].map(([key, value])=> {
        if(key === FilterItems.New) {
          return
          // return <p className={value.active&&styles.active} >{key}</p>
        }

        return <Accordeon 
        classNames={{root: styles.accRoot, content: styles.accContent, wrapper: styles.accWrapper }}
        onOutsideClick={()=>accordeonHandler()}
        body={
          <p onClick={()=>accordeonHandler(value)} className={classNames(styles.item, value===activeFilter&&styles.item_active)}>{value.translation} <ArrowDownSvg/></p>
        } isActive={value===activeFilter}>
          <>
            {value.translatedItems && value.translatedItems.map((el, index)=>{
              return <p className={classnames(styles.accItem, filterOptions.get(value)?.translatedActiveItem===el&&styles.accItem_active)} onClick={()=>filterOptionsHandler(value, index)}>{el}</p>
            })}
          </>
        </Accordeon>
      })}

    </div>
    <div className={styles.filterResults}>
    {filterOptions.size > 0 && 
      [...filterOptions.entries()].map(([k, v])=> {
        return <RemovableItem text={v.translatedActiveItem} onClick={()=> filterOptionsHandler(k, undefined)}/>
      })
    }
    </div>
  </div>)
}