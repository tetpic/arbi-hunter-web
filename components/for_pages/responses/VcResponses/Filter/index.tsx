import classnames from 'classnames'
import classNames from 'classnames'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import Accordeon from 'components/ui/Accordeon'
import RemovableItem from 'components/ui/RemovableItem'
import Spinner from 'components/ui/Spinner'
import { useFeedbacksContext } from 'context/feedbacks_state'
import { FilterItem, FilterItems } from 'data/interfaces/IFilter'
import { useEffect, useState } from 'react'
import { colors } from 'styles/variables'
import { EducationTypes, Genders, ProposalRequestType, WorkExperience } from 'types/enums'
import { arrayFromEnum, TranslateEducationType, TranslateGenderType, TranslateWorkExperience } from 'utils/enumsTranslations'
import styles from './index.module.scss'





interface Props {
  filtersHandler?: (v: Map<FilterItem, FilterItem>)=> void
}

export default function ResponsesFilter(props: Props) {

  const feedbacksContext = useFeedbacksContext()
  const {filterOptions, setFilterOptions} = feedbacksContext
  const [filters, setFilters] = useState<Map<FilterItems, FilterItem>>(new Map())
  const [activeFilter, setActiveFilter] = useState<FilterItem>()
  const responsesContext = useFeedbacksContext()
  const [switcher, setSwitcher] = useState<boolean>(false)
  const [switcherLoading, setSwitcherLoading] = useState<boolean>(false)
  

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
      case FilterItems.New:
        return {type: p, translation: 'Только новые'}
    }
  }

  const onlyNewHandler = (value?: FilterItem) => {
    if(switcher===false) {
      setSwitcherLoading(true)
      responsesContext.setResponsesByStat(ProposalRequestType.New)
      .then(res=> {
        responsesContext.setFilteredVcResponses(res)       
        setSwitcher(true)
        setSwitcherLoading(false)
      })
     
    }
    else if(switcher===true) {
      setSwitcherLoading(true)
      responsesContext.setResponsesByStat(null)
      .then(res=> {
        responsesContext.setFilteredVcResponses(res)      
        setSwitcher(false)
        setSwitcherLoading(false)
      })
    }
  }

  const accordeonHandler = (value?: FilterItem) => {    
    setActiveFilter(activeFilter===value?null:value)
  }

  const filterOptionsHandler = (value: FilterItem, index: number) => {
    setFilterOptions(state=> {
      if(index === undefined) {
        state.delete(value)
        return new Map(state)
      }
      state.set(value, {...value, activeItem: value.items[index], translatedActiveItem: value.translatedItems[index]})
      return new Map(state)
    })
    setActiveFilter(null)
  }

  useEffect(()=>{    
    feedbacksContext.withFilter()
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
      {[...filters.entries()].map(([key, value], index)=> {
        if(key === FilterItems.New) {
          return (
            <div key={index} className={styles.item} onClick={()=>onlyNewHandler(value)} >
              Только новые
              <div className={classNames(styles.switcher, switcher&&styles.switcher_active)}>
                <div className={styles.roller}>
                  {switcherLoading&&<Spinner size={20} color={colors.red} secondaryColor={colors.yellow}/>}
                </div>
              </div>
            </div>
          )
        }

        return <Accordeon 
        key={index}
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
    {filterOptions.size > 0 && 
    <div className={styles.filterResults}>
      {
        [...filterOptions.entries()].map(([k, v], index)=> {
          return <RemovableItem key={index} text={v.translatedActiveItem} onClick={()=> filterOptionsHandler(k, undefined)}/>
        })
      }
    </div>
    }
  </div>)
}