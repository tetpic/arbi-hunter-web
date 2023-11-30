import styles from './index.module.scss'
import CvCard from 'components/ui/CvCard'
import Spinner from 'components/ui/Spinner'
import { useFeedbacksContext } from 'context/feedbacks_state'
import { useEffect, useState } from 'react'
import { ApplicationStatus, ModalType} from 'types/enums'
import ResponsesFilter from './Filter'
import ResponsesNavigation from '../Navigation'
import { useResize } from 'components/hooks/useResize'
import Title from 'components/ui/TitleForSection'
import { useRouter } from 'next/navigation'
import { IStat } from 'data/interfaces/IProposal'
import FiltersSvg from 'components/svg/FiltersSvg'
import { useAppContext } from 'context/state'

interface Props {
  id?: number
}

export enum VCNaviagation {
  All= 'all',
  Applied = 'applied',
  Interview = 'interview',
  Rejection = 'rejection',
}

export interface NavSet {
  name: string, 
  type: VCNaviagation, 
  count?: string
}

const TranslateVCNavigation = (v: VCNaviagation) =>{
  switch(v) {
    case VCNaviagation.All: 
    return 'Все отклики'
    case VCNaviagation.Interview: 
    return 'Приглашение'
    case VCNaviagation.Applied:
    return 'Неразобранные'
    case VCNaviagation.Rejection:
    return 'Отказ'
  }
}

export default function VCFeedbacks(props: Props) {  
  
  const responsesContext = useFeedbacksContext()
  const appContext = useAppContext()
  const {setStats, stats, filterOptions} = responsesContext
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<VCNaviagation>(VCNaviagation.All)
  const {isTabletWidth} = useResize()
  const [showNav, setShowNav] = useState<boolean>(isTabletWidth)
  const [loading, setLoading] = useState<boolean>(true)
  const [navSet, setNavSet] = useState<NavSet[]>([])

  const navigationSet = (stats: IStat[]) => {
    let res = Object.values(VCNaviagation).map((el)=> {
      const count = stats.find(s=> s.status === (el===VCNaviagation.Rejection?ApplicationStatus.Rejected:el===VCNaviagation.Applied?ApplicationStatus.Applied:ApplicationStatus.Accepted))
      return {name: TranslateVCNavigation(el), type: el, count: (el !== VCNaviagation.All ? count?.count||'0' : responsesContext?.VCFeedbacks?.size).toString()}
    })
    setNavSet(res)
    setLoading(false)
  }

  useEffect(()=>{
    if(responsesContext.VCFeedbacks.size && stats) {      
      navigationSet(stats)
    }
  }, [stats, responsesContext.VCFeedbacks])

  
  useEffect(()=>{    
    const feedbacks = [...responsesContext.VCFeedbacks.values()]
    let arr: any
    switch(currentPage) {
      case VCNaviagation.All:
        responsesContext.setFilteredVcResponses(feedbacks)
        responsesContext.setSorted(null)
        break
      case VCNaviagation.Interview:
        arr = [...responsesContext.VCFeedbacks.values()].filter(el=> el.status === ApplicationStatus.Accepted)
        responsesContext.setSorted(arr)     
        break
      case VCNaviagation.Rejection: 
        arr = [...responsesContext.VCFeedbacks.values()].filter(el=> el.status === ApplicationStatus.Rejected)||[]
        responsesContext.setSorted(arr)
        break
      case VCNaviagation.Applied:
        arr = [...responsesContext.VCFeedbacks.values()].filter(el=> el.status === ApplicationStatus.Applied)||[]
        responsesContext.setSorted(arr)
        break

    }
  }, [currentPage, responsesContext.VCFeedbacks])

  const openFiltersHandler = () => {
    appContext.showBottomSheet(ModalType.VcResponsesFilterModal)
  }

  const onNavigationClick = (t: VCNaviagation) => {
    setCurrentPage(t)
    if(isTabletWidth) {
      setShowNav(false)
    }
  }

  const init = () => {
    setStats(props.id)
    responsesContext.setVCResponses(props.id)
    .then(_=> {
      setLoading(false)
    })
  }

  useEffect(()=>{
    init()
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
      {isTabletWidth
      ?<p className={styles.openFilters} onClick={openFiltersHandler}><FiltersSvg/>{filterOptions.size>0?'Фильтры':'Фильтр'} {filterOptions.size>0&&<span className={styles.counter}>{filterOptions.size}</span>}</p>
      :<ResponsesFilter />
      }
      {
        responsesContext.filteredVcResponses.length>0&&!loading&&
        responsesContext.filteredVcResponses.map(el=> {
          return <CvCard onChangeItem={()=>init()} cv={el.cv} key={el.id} application={el} vcId={props.id} chat={el.chat[0]} />
        })
        ||
        loading && <Spinner size={24} />
        ||
        <p className={'empty'}>Нет откликов</p>
      }
      </>
    }

  </div>
  {((showNav  && isTabletWidth) || !isTabletWidth) && responsesContext.VCFeedbacks &&
    <ResponsesNavigation items={navSet} onClick={(t: VCNaviagation) => onNavigationClick(t)} active={currentPage} />
  }
  </div>)
}