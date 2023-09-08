import CvCard from 'components/ui/CvCard'
import Spinner from 'components/ui/Spinner'
import { useResponseContext } from 'context/response_state'
import { IApplication } from 'data/interfaces/IApplication'
import { useEffect, useState } from 'react'
import { colors } from 'styles/variables'
import { ProposalRequestType } from 'types/enums'
import ResponsesFilter from '../Filter'
import ResponsesNavigation from '../Navigation'
import styles from './index.module.scss'

interface Props {
  id?: number
}

enum VCNaviagation {
  All= 'all',
  Interview = 'interview',
  Rejection = 'rejection'
}

export default function VCResponses(props: Props) {  
  
  const responsesContext = useResponseContext()
  const [currentPage, setCurrentPage] = useState<VCNaviagation>(VCNaviagation.All)
  const [filteredCVs, setFilteredCVs] = useState<IApplication[]>([...responsesContext.VCResponses.values()])
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
        setFilteredCVs([...responsesContext.VCResponses.values()])
        break
      case VCNaviagation.Interview:
        setLoading(true)
        responsesContext.setResponsesByStat(ProposalRequestType.Interview)
        .then(res => {
          setFilteredCVs(res)
          setLoading(false)
        })
        break
      case VCNaviagation.Rejection: 
        responsesContext.setResponsesByStat(ProposalRequestType.Rejection)
        .then(res=> {
          setFilteredCVs(res)
        })
        break
    }
  }, [currentPage, responsesContext.VCResponses])

  

  useEffect(()=>{
    responsesContext.setVCResponses(props.id)
  }, [])

  return (<div className={styles.root}> 
  <div className={styles.main}>
    <h1 className={styles.title}>Отклики</h1>
    {filteredCVs.length > 0 &&
        <ResponsesFilter/>
    }
    {
      filteredCVs.length>0&&
      filteredCVs.map(el=> {
        return <CvCard cv={el.cv}/>
      })
      ||
      loading && <Spinner size={24} color={colors.yellow}/>
      ||
      <p className={styles.empty}>Нет откликов</p>
    }
  </div>
  <ResponsesNavigation items={navigationSet} onClick={(t: VCNaviagation) => setCurrentPage(t)} active={currentPage} className={''}/>
  </div>)
}