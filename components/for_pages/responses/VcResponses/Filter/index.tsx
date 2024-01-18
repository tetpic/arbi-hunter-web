import styles from './index.module.scss'

import classnames from 'classnames'
import Radio from 'components/fields/RadioListField/Radio'
import { useResize } from 'components/hooks/useResize'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import Accordeon from 'components/ui/Accordeon'
import RemovableItem from 'components/ui/RemovableItem'
import Spinner from 'components/ui/Spinner'
import { useFeedbacksContext } from 'context/feedbacks_state'
import { FilterItem, FilterItems } from 'data/interfaces/IFilter'
import { useEffect, useRef, useState } from 'react'
import { colors } from 'styles/variables'
import { ProposalRequestType} from 'types/enums'
import { useDetectOutsideClick } from 'components/hooks/useDetectOutsideClick'


interface Props {
  filtersHandler?: (v: Map<FilterItem, FilterItem>)=> void
}

export default function ResponsesFilter(props: Props) {

  const feedbacksContext = useFeedbacksContext()
  const {isTabletWidth} = useResize()
  const {filterOptions, setFilterOptions, filters} = feedbacksContext
  const [activeFilter, setActiveFilter] = useState<FilterItem>()
  const [switcher, setSwitcher] = useState<boolean>(false)
  const [switcherLoading, setSwitcherLoading] = useState<boolean>(false)
  const dropdownRef = useRef(null!)
  const [isDropDownOpen, setDropDownOpen] = useDetectOutsideClick(dropdownRef, false)


  const onlyNewHandler = (value?: FilterItem) => {
    if(switcher===false) {
      setSwitcherLoading(true)
      feedbacksContext.setResponsesByStat(ProposalRequestType.New)
      .then(res=> {
        feedbacksContext.setFilteredVcResponses(res)       
        setSwitcher(true)
        setSwitcherLoading(false)
      })
     
    }
    else if(switcher===true) {
      setSwitcherLoading(true)
      feedbacksContext.setResponsesByStat(null)
      .then(res=> {
        feedbacksContext.setFilteredVcResponses(res)      
        setSwitcher(false)
        setSwitcherLoading(false)
      })
    }
  }

  const accordeonHandler = (value?: FilterItem) => {   
    setActiveFilter(activeFilter===value?null:value)
    setDropDownOpen(activeFilter===value?false:true)
  }

  useEffect(()=>{
    if(!isDropDownOpen) {
      setActiveFilter(null)
    }
  }, [isDropDownOpen])

  

  return (<div className={styles.root}>
    <div className={styles.filterWrapper}>
      {[...filters.entries()].map(([key, value], index)=> {
        if(key === FilterItems.New) {
          return (
            <div key={index} className={styles.item} onClick={()=>onlyNewHandler(value)} >
              Только новые
              <div className={classnames(styles.switcher, switcher&&styles.switcher_active)}>
                <div className={styles.roller}>
                  {switcherLoading&&<Spinner size={20} color={colors.red} secondaryColor={colors.yellow}/>}
                </div>
              </div>
            </div>
          )
        }
        else {
          return (
            isTabletWidth
          ? <div className={styles.radioWrapper}>
              <p className={styles.item}>{value.translation}</p>
              {value.translatedItems.map((el, index)=>{
                return (
                  <Radio 
                  key={index} 
                  value={el} 
                  label={el} 
                  isActive={filterOptions.get(value)?.translatedActiveItem===el} 
                  onChange={()=>setFilterOptions(value, index)}
                  />
                )
              })}
            </div>
          : <Accordeon 
            key={index}
            classNames={{root: styles.accRoot, content: styles.accContent, wrapper: styles.accWrapper }}
            body={
              <p onClick={(e)=>{e.stopPropagation();accordeonHandler(value)}} className={classnames(styles.item, value===activeFilter&&styles.item_active)}>{value.translation} <ArrowDownSvg/></p>
            } 
            getRef={(r) => dropdownRef.current = r}
            isActive={value===activeFilter && isDropDownOpen}>
              <>
                {value.translatedItems && value.translatedItems.map((el, index)=>{
                  return (
                    <p 
                    key={index}
                    className={classnames(styles.accItem, filterOptions.get(value)?.translatedActiveItem===el&&styles.accItem_active)} 
                    onClick={()=>setFilterOptions(value, index)}>
                      {el}
                    </p>
                  )
                })}
              </>
            </Accordeon>
        )}
        
      })}

    </div>
    {filterOptions.size > 0 && !isTabletWidth &&
    <div className={styles.filterResults}>
      {
        [...filterOptions.entries()].map(([k, v], index)=> {
          return <RemovableItem 
          key={index} 
          text={v.translatedActiveItem} 
          onClick={()=> setFilterOptions(k, undefined)}
          />
        })
      }
    </div>
    }
  </div>)
}