import classNames from 'classnames'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import Accordeon from 'components/ui/Accordeon'
import { useEffect, useState } from 'react'
import { EducationTypes, WorkExperience } from 'types/enums'
import styles from './index.module.scss'

interface Props {
}

enum FilterItems {
  Experience = 'experience',
  Age = 'age',
  Education = 'education',
  Gender = 'gender',
  New = 'onlyNew'
}

interface FilterItem {
  active: boolean, 
  items?: string[], 
  activeItem?: string|null
  translation: string
}

export default function ResponsesFilter(props: Props) {

  const [activeItems, setActiveItems] = useState<Map<FilterItems, FilterItem>>(new Map())

  const getItems = (p: FilterItems): FilterItem => {
    switch(p) {
      case FilterItems.Age:
        return {active: false, items: ['18-30', '30-40', '40-50', '>50'], activeItem: null, translation: 'Возраст'}
      case FilterItems.Education:
        return {active: false, items: [...Object.values(EducationTypes).map(el=> el)], activeItem: null, translation: 'Образование'}
      case FilterItems.Experience:
        return {active: false, items: [...Object.values(WorkExperience).map(el=>el)], activeItem: null, translation: 'Опыт'}
      case FilterItems.Gender:
        return {active: false, items:['male', 'female'], activeItem: null, translation: 'Пол'}
      case FilterItems.New:
        return {active: false, translation: 'Только новые'}
    }
  }

  useEffect(()=>{
    Object.values(FilterItems).forEach(el => {
      setActiveItems(state=> {
        state.set(el, getItems(el))
        return new Map(state)
      })
    })
  }, [])

  return (<div className={styles.root}>
    {[...activeItems.entries()].map(([key, value])=> {
      if(key === FilterItems.New) {
        return
        // return <p className={value.active&&styles.active} >{key}</p>
      }

      return <Accordeon 
      classNames={{root: styles.accRoot, content: styles.accContent, wrapper: styles.accWrapper }}
      body={
        <p onClick={()=>setActiveItems(state=> {
          state.set(key, {...value, active: !value.active})
          return new Map(state)
        })} className={classNames(styles.item, value.active&&styles.item_active)}>{value.translation} <ArrowDownSvg/></p>
      } isActive={value.active}>
        <>
          {value.items && value.items.map(el=>{
            return <p className={styles.accItem}>{el}</p>
          })}
        </>
      </Accordeon>
    })}

    
  
    

  </div>)
}