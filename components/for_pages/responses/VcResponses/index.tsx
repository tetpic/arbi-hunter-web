import CvCard from 'components/ui/CvCard'
import Spinner from 'components/ui/Spinner'
import { useFeedbacksContext } from 'context/feedbacks_state'
import { useEffect, useState } from 'react'
import { colors } from 'styles/variables'
import { ApplicationStatus} from 'types/enums'
import ResponsesFilter from './Filter'
import ResponsesNavigation from '../Navigation'
import styles from './index.module.scss'
import { useResize } from 'components/hooks/useResize'
import Title from 'components/ui/TitleForSection'
import { useRouter } from 'next/navigation'
import { IStat } from 'data/interfaces/IProposal'

interface Props {
  id?: number
}

export enum VCNaviagation {
  All= 'all',
  Interview = 'interview',
  Rejection = 'rejection'
}

export interface NavSet {
  name: string, 
  type: VCNaviagation, 
  count?: number
}

export default function VCFeedbacks(props: Props) {  
  
  const responsesContext = useFeedbacksContext()
  const {withFilter, setStats, stats} = responsesContext
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<VCNaviagation>(VCNaviagation.All)
  const {isTabletWidth} = useResize()
  const [showNav, setShowNav] = useState<boolean>(isTabletWidth)
  const [loading, setLoading] = useState<boolean>(true)
  const [navSet, setNavSet] = useState<NavSet[]>([])

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

  const navigationSet = (stats: IStat[]) => {
    let res = Object.values(VCNaviagation).map(el=> {
      const count = stats.find(s=> s.status === (el===VCNaviagation.Rejection?ApplicationStatus.Rejected:ApplicationStatus.Applied))
      return {name: TranslateVCNavigation(el), type: el, count: count?count.count:0}
    })
    setNavSet(res)
  }

  useEffect(()=>{
    navigationSet(stats)
  }, [stats])

  
  useEffect(()=>{    
    setLoading(true)
    const feedbacks = [...responsesContext.VCFeedbacks.values()]
    let arr: any
    switch(currentPage) {
      case VCNaviagation.All:
        responsesContext.setFilteredVcResponses(feedbacks)
        withFilter()
        setLoading(false)
        break
      case VCNaviagation.Interview:
        arr = [...responsesContext.VCFeedbacks.values()].filter(el=> el.status === ApplicationStatus.Applied)
        withFilter(arr)
        // responsesContext.setFilteredVcResponses(arr)      
        setLoading(false)
        break
      case VCNaviagation.Rejection: 
        arr = [...responsesContext.VCFeedbacks.values()].filter(el=> el.status === ApplicationStatus.Rejected)||[]
        withFilter(arr)
        // responsesContext.setFilteredVcResponses(arr)
        setLoading(false)
        break
    }
  }, [currentPage, responsesContext.VCFeedbacks])

 

  const onNavigationClick = (t: VCNaviagation) => {

    setCurrentPage(t)
    if(isTabletWidth) {
      setShowNav(false)
    }
  }

  useEffect(()=>{
    setStats(props.id)
    responsesContext.setVCResponses(props.id)
    .then(res=> {
      setLoading(false)
    })
  }, [])

  useEffect(()=>{
    
  }, [currentPage])

  return (<div className={styles.root}> 
  <div className={styles.main}>
    {
      ((isTabletWidth&&showNav)||!isTabletWidth)&&<Title onBackClick={()=>router.back()} title='Отклики' className={styles.title}/>
      ||
      isTabletWidth&&!showNav&&<Title className={styles.title} title={TranslateVCNavigation(currentPage)} onBackClick={()=>setShowNav(true)}/>
    }

    {((!showNav && isTabletWidth) || !isTabletWidth ) &&
      <>
      <ResponsesFilter />
      {
        responsesContext.filteredVcResponses.length>0&&!loading&&
        responsesContext.filteredVcResponses.map(el=> {
          return <CvCard cv={el.cv} application={el} vcId={props.id} chat={el.chat[0]} />
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
    <ResponsesNavigation items={navSet} onClick={(t: VCNaviagation) => onNavigationClick(t)} active={currentPage} />
  }
  </div>)
}