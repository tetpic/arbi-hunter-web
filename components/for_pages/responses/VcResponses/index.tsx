import styles from './index.module.scss'
import CvCard from 'components/ui/CvCard'
import { useFeedbacksContext } from 'context/feedbacks_state'
import { useEffect, useState } from 'react'
import { ApplicationStatus, ProposalRequestType} from 'types/enums'
import { useResize } from 'components/hooks/useResize'
import Title from 'components/ui/TitleForSection'
import { useRouter } from 'next/navigation'
import { IStat } from 'data/interfaces/IProposal'
import { useVacancyContext } from 'context/vacancy_state'
import { useFavoritesFolderContext } from 'context/favorites_folder_state'
import { ICV } from 'data/interfaces/ICV'
import { Translate } from 'next-translate'
import useTranslation from 'next-translate/useTranslation'
import ItemNavigation from '@/components/ui/ItemNavigation'
import Spacer from '@/components/ui/Spacer'

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

const TranslateVCNavigation = (v: VCNaviagation, t: Translate) =>{
  switch(v) {
    case VCNaviagation.All: 
    return t('profile_feedbacks_all')
    case VCNaviagation.Interview: 
    return t('profile_feedbacks_invite')
    case VCNaviagation.Applied:
    return t('chatFilterModal_unsorted')
    case VCNaviagation.Rejection:
    return t('profile_feedbacks_reject')
  }
}

export default function VCFeedbacks(props: Props) {  
  const {t} = useTranslation()
  const responsesContext = useFeedbacksContext()
  const vacancyContext = useVacancyContext()
  const {setStats, stats} = responsesContext
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<VCNaviagation>(VCNaviagation.All)
  const {isTabletWidth} = useResize()
  const [showNav, setShowNav] = useState<boolean>(isTabletWidth)
  const [loading, setLoading] = useState<boolean>(true)
  const [navSet, setNavSet] = useState<NavSet[]>([])
  const folderContext = useFavoritesFolderContext()

  const navigationSet = (stats: IStat[]) => {
    let res = Object.values(VCNaviagation).map((el)=> {
      const count = stats.find(s=> s.status === (el===VCNaviagation.Rejection?ApplicationStatus.Rejected:el===VCNaviagation.Applied?ApplicationStatus.Applied:ApplicationStatus.Accepted))
      return {name: TranslateVCNavigation(el, t), type: el, count: (el !== VCNaviagation.All ? count?.count||'0' : responsesContext?.VCFeedbacks?.size).toString()}
    })
    setNavSet(res)
    setLoading(false)
  }

  useEffect(()=>{
    navigationSet(stats)
  }, [stats, responsesContext.VCFeedbacks])


  const sortItems = () => {
    const feedbacks = [...responsesContext.VCFeedbacks.values()]
    let arr: any
    switch(currentPage) {
      case VCNaviagation.All:
        responsesContext.setFilteredVcResponses(feedbacks)
        responsesContext.setSorted(null)
        break
      case VCNaviagation.Interview:
        arr = [...responsesContext.VCFeedbacks.values()].filter(el=> el.status === ApplicationStatus.Accepted||(el.type !== ProposalRequestType.Rejection && el.type !== undefined))
        responsesContext.setSorted(arr)     
        break
      case VCNaviagation.Rejection: 
        arr = [...responsesContext.VCFeedbacks.values()].filter(el=> el.status === ApplicationStatus.Rejected||(el.type === ProposalRequestType.Rejection && el.type !== undefined))||[]
        responsesContext.setSorted(arr)
        break
      case VCNaviagation.Applied:
        arr = [...responsesContext.VCFeedbacks.values()].filter(el=> el.status === ApplicationStatus.Applied && el.type === undefined)||[]
        responsesContext.setSorted(arr)
        break
    }
  }

  
  useEffect(()=>{    
    sortItems()
  }, [currentPage, responsesContext.VCFeedbacks])

  useEffect(()=>{
    vacancyContext.setVacancies()
    folderContext.getAllFolders()
  }, [])

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

  const changeItem = (cv: ICV) => {
    init()
    sortItems()
  }

  useEffect(()=>{
    init()
  }, [])

  return (<div className={styles.root}> 
  <div className={styles.main}>
  <Title onBackClick={()=>router.back()} title={t('item_feedbacks')} className={styles.title}/>
    
    <ItemNavigation activeItem={currentPage} items={navSet} onClick={onNavigationClick}/>
    <Spacer basis={24}/>

    {((!showNav && isTabletWidth) || !isTabletWidth ) &&
      <>
      {
        responsesContext.filteredVcResponses.length>0&&!loading&&
        responsesContext.filteredVcResponses.filter(e => !e.cvDeletedOrHidden).map(el=> {
          return <CvCard onChangeItem={changeItem} cv={el.cv} key={el.id} application={el} vcId={props.id} chat={el.chat[0]} />
        })
      }
      </>
    }

  </div>
  </div>)
}