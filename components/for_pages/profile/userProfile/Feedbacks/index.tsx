import { useFeedbacksContext } from 'context/feedbacks_state'
import { useEffect, useState } from 'react'
import { ApplicationStatus } from 'types/enums'
import ItemNavigation from '../../ItemNavigation'
import VacancyItem from '../Saved/Vacancies/VacancyItem'
import styles from './index.module.scss'
import { IProposal } from 'data/interfaces/IProposal'
import Spinner from 'components/ui/Spinner'

interface Props {
}

enum ReviewsNavigation {
  Any = 'any',
  Invite = 'invite',
  Wait = 'wait',
  Reject = 'reject',
}

function translate (n: ReviewsNavigation) {
  switch(n) {
    case ReviewsNavigation.Any:
      return 'Любые отклики'
    case ReviewsNavigation.Invite:
      return 'Приглашение'
    case ReviewsNavigation.Wait:
      return 'Ожидание'
    case ReviewsNavigation.Reject:
      return 'Отказ'
  
  }
}

export default function Feedbacks(props: Props) {

  const feedBackContext = useFeedbacksContext()
  const {CVFeedbacks} = feedBackContext

  const [page, setPage] = useState<ReviewsNavigation>(ReviewsNavigation.Any)
  const items = Object.values(ReviewsNavigation).map(el=> {return {name: translate(el), type: el}})
  const [filtered, setFiltered] = useState<Map<number, IProposal>>(CVFeedbacks)
  const [loading, setLoading] = useState<boolean>(true)

  const onRemove = () => {
    setLoading(true)
    feedBackContext.setCVResponses()
    .then(_=>setLoading(false))
  }

  useEffect(()=>{    
    switch(page) {
      case ReviewsNavigation.Any :
        setFiltered(state=> {
          return new Map(CVFeedbacks)
        })
      break
      case ReviewsNavigation.Invite: 
        setFiltered(state=> {
            state.clear();
            [...CVFeedbacks.entries()].filter(([key, value])=> value.status === ApplicationStatus.Accepted)
            .map(([app, vc])=>{
              state.set(app, vc)
            })
            return new Map(state)
        })
      break
      case ReviewsNavigation.Wait:
        setFiltered(state=> {
          state.clear();
          [...CVFeedbacks.entries()].filter(([key, value])=> value.status === ApplicationStatus.Applied)
          .map(([app, vc])=>{
            state.set(app, vc)
          })
          return new Map(state)

        })
      break
      case ReviewsNavigation.Reject:
        setFiltered(state=> {
          state.clear();
          [...CVFeedbacks.entries()].filter(([key, value])=> value.status === ApplicationStatus.Rejected)
          .map(([app, vc])=> {
            state.set(app, vc)
          })
          return new Map(state)
        })
      break
    }
  
  }, [page, CVFeedbacks])

  useEffect(()=>{
    feedBackContext.setCVResponses()
    .then(_=>setLoading(false))
    return ()=>{
      feedBackContext.setCurrentCvResponsesState({})
    }
  }, [])

  return (
    <div className={styles.root}>
      <ItemNavigation activeItem={page} items={items} onClick={(n)=>setPage(n)} className={styles.navigation}/>
      <div className={styles.wrapper}>
        {
          filtered.size > 0 && !loading && [...filtered.entries()].map(([id, proposal])=> {
            if(proposal.chat.length === 0) return null
            return (<VacancyItem  onRemove={onRemove} vc={proposal.vacancy} proposal={proposal} refreshCallback={feedBackContext.setCVResponses}/>)
          })
          ||
          loading &&
          <Spinner size={24}/>
          ||
          <p className={'empty'}>Нет откликов</p>
        }
      </div>
    </div>)
}