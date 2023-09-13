import CvCard from 'components/ui/CvCard'
import Spinner from 'components/ui/Spinner'
import { useFeedbacksContext } from 'context/feedbacks_state'
import { IApplication } from 'data/interfaces/IApplication'
import { useEffect, useState } from 'react'
import { colors } from 'styles/variables'
import { ProposalRequestType } from 'types/enums'
import ResponsesFilter, { FilterItem } from './Filter'
import ResponsesNavigation from '../Navigation'
import styles from './index.module.scss'
import { ICV } from 'data/interfaces/ICV'
import { useResize } from 'components/hooks/useResize'
import Title from 'components/ui/TitleForSection'
import { useRouter } from 'next/navigation'

interface Props {
  id?: number
}

enum VCNaviagation {
  All= 'all',
  Interview = 'interview',
  Rejection = 'rejection'
}

export default function VCFeedbacks(props: Props) {  
  
  const responsesContext = useFeedbacksContext()
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<VCNaviagation>(VCNaviagation.All)
  const {isTabletWidth} = useResize()
  const [showNav, setShowNav] = useState<boolean>(isTabletWidth)
  const [loading, setLoading] = useState<boolean>(false)

  const TranslateVCNavigation = (v: VCNaviagation) =>{
    switch(v) {
      case VCNaviagation.All: 
      return 'Все отклики'
      case VCNaviagation.Interview: 
      return 'Приглашение'
      case VCNaviagation.Rejection:
      return 'Отказ'
    }
  }

  const navigationSet: {name: string, type: VCNaviagation}[] = 
  Object.values(VCNaviagation).map(el=> {
      return {name: TranslateVCNavigation(el), type: el}
  })
  
  useEffect(()=>{
    switch(currentPage) {
      case VCNaviagation.All:
        responsesContext.setFilteredVcResponses([...responsesContext.VCFeedbacks.values()])
        break
      case VCNaviagation.Interview:
        setLoading(true)
        responsesContext.setResponsesByStat(ProposalRequestType.Interview)
        .then(res => {
          responsesContext.setFilteredVcResponses(res)
          setLoading(false)
        })
        break
      case VCNaviagation.Rejection: 
        responsesContext.setResponsesByStat(ProposalRequestType.Rejection)
        .then(res=> {
          responsesContext.setFilteredVcResponses(res)
        })
        break
    }
  }, [currentPage, responsesContext.VCFeedbacks])

  const filtersHandler = (v: Map<FilterItem, FilterItem>) => {
    const all = [...responsesContext.VCFeedbacks.values()]
    if(v.size === 0) {
      responsesContext.setFilteredVcResponses(all)
    }
    let filtered: IApplication[] =  all;
    [...v.entries()].forEach(([key, value])=>{
      let keyType = value.type as keyof ICV
      if(keyType === 'age') {
        let ageArr = value.activeItem.split(' ')
        filtered = filtered.filter(el=> el.cv.age > +ageArr[0]&&el.cv.age < +ageArr[1])
      }
      else {
        filtered = filtered.filter(el=> el.cv[keyType] === value.activeItem)
      }
      responsesContext.setFilteredVcResponses(filtered)
    })
  }

  const onNavigationClick = (t: VCNaviagation) => {
    setCurrentPage(t)
    if(isTabletWidth) {
      setShowNav(false)
    }
  }

  useEffect(()=>{
    responsesContext.setVCResponses(props.id)
  }, [])

  return (<div className={styles.root}> 
  <div className={styles.main}>
    {
      ((isTabletWidth&&showNav)||!isTabletWidth)&&<Title onBackClick={()=>router.back()} title='Отклики' className={styles.title}/>
      ||
      isTabletWidth&&!showNav&&<Title className={styles.title} title={TranslateVCNavigation(currentPage)} onBackClick={()=>setShowNav(true)}/>
    }

    {((!showNav && isTabletWidth) || !isTabletWidth ) &&
      <>
      <ResponsesFilter filtersHandler={(v) => {filtersHandler(v)}}/>
      {
        responsesContext.filteredVcResponses.length>0&&
        responsesContext.filteredVcResponses.map(el=> {
          return <CvCard cv={el.cv} vcId={props.id} chat={el.chat[0]} />
        })
        ||
        loading && <Spinner size={24} color={colors.yellow}/>
        ||
        <p className={styles.empty}>Нет откликов</p>
      }
      </>
    }

  </div>
  {((showNav && isTabletWidth) || !isTabletWidth) &&
    <ResponsesNavigation items={navigationSet} onClick={(t: VCNaviagation) => onNavigationClick(t)} active={currentPage} className={''}/>
  }
  </div>)
}