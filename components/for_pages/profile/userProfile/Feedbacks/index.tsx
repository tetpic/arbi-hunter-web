import styles from './index.module.scss'

import { useFeedbacksContext } from 'context/feedbacks_state'
import { useEffect, useState } from 'react'
import { ApplicationStatus, ProposalRequestType } from 'types/enums'
import ItemNavigation from '../../ItemNavigation'
import VacancyItem from '../Saved/Vacancies/VacancyItem'
import { IProposal } from 'data/interfaces/IProposal'
import Spinner from 'components/ui/Spinner'
import Formatter from 'utils/formatter'

enum ReviewsNavigation {
  Any = 'any',
  Invite = 'invite',
  Wait = 'wait',
  Reject = 'reject',
}

function translate (n: ReviewsNavigation) {
  switch(n) {
    case ReviewsNavigation.Any:
      return 'Все отклики'
    case ReviewsNavigation.Invite:
      return 'Приглашение'
    case ReviewsNavigation.Wait:
      return 'Ожидание'
    case ReviewsNavigation.Reject:
      return 'Отказ'
  }
}

export default function Feedbacks() {

  const feedBackContext = useFeedbacksContext()
  const {CVFeedbacks} = feedBackContext

  const [page, setPage] = useState<ReviewsNavigation>(ReviewsNavigation.Any)
  const items = Object.values(ReviewsNavigation).map(el=> {return {name: translate(el), type: el}})
  const [filtered, setFiltered] = useState<Map<number, IProposal>>(CVFeedbacks)
  const [loading, setLoading] = useState<boolean>(true)
  const [itemsHidden, setItemsHidden] = useState<Map<number, IProposal>>(new Map)

  const onRemove = (id:number) => {
    feedBackContext.removeProposal(id)
    setFiltered(state=> {
      state.delete(id)
      return new Map(state)
    })
    // setLoading(true)
    // feedBackContext.setCVResponses()
    // .then(_=>setLoading(false))
  }


  //надо отрефакторить, а то я долго соображал как их фильтровать... и пока что это рабочий вариант
  useEffect(()=>{ 
    const cvEntries:[number, IProposal][] = [...CVFeedbacks.entries()]
    const itemsActiveFilter = cvEntries.filter(([key, value]) => !value.cvDeletedOrHidden&&!value.vacancyDeletedOrHidden)
    const itemsHiddenFilter = cvEntries.filter(([key, value])=> value.cvDeletedOrHidden||value.vacancyDeletedOrHidden)

    switch(page) {
      case ReviewsNavigation.Any :
        setFiltered(_=> {
          return new Map(itemsActiveFilter)
        })
        setItemsHidden(_ => {
          return new Map(itemsHiddenFilter)
        })
        break

      case ReviewsNavigation.Invite: 
        setFiltered(state=> {
          state.clear()
          itemsActiveFilter.filter(([_, value])=> value.notification?(value.status === ApplicationStatus.Applied && value.type === ProposalRequestType.Interview):value.status === ApplicationStatus.Accepted)
          .map(([app, vc])=>{
            state.set(app, vc)
          })
          return new Map(state)
        })
        setItemsHidden(state=> {
          state.clear()
          itemsHiddenFilter.filter(([_, value])=> value.notification?(value.status === ApplicationStatus.Applied && value.type === ProposalRequestType.Interview):value.status === ApplicationStatus.Accepted)
          .map(([app, vc])=>{
            state.set(app, vc)
          })
          return new Map(state)
        })       
        break

      case ReviewsNavigation.Wait:
        setFiltered(state=> {
          state.clear()
          itemsActiveFilter.filter(([_, value])=> value.notification?(value.status === ApplicationStatus.Applied && value.type === ProposalRequestType.InfoRequest):value.status === ApplicationStatus.Applied)
          .map(([app, vc])=>{
            state.set(app, vc)
          })
          return new Map(state)
        })
        setItemsHidden(state=> {
          state.clear()
          itemsHiddenFilter.filter(([_, value])=> value.notification?(value.status === ApplicationStatus.Applied && value.type === ProposalRequestType.InfoRequest):value.status === ApplicationStatus.Applied)
          .map(([app, vc])=>{
            state.set(app, vc)
          })
          return new Map(state)
        })
        break

      case ReviewsNavigation.Reject:
        setFiltered(state=> {
          state.clear()
          itemsActiveFilter.filter(([_, value])=> value.notification?(value.status === ApplicationStatus.Rejected && value.type === ProposalRequestType.Interview):value.status === ApplicationStatus.Rejected)
          .map(([app, vc])=>{
            state.set(app, vc)
          })
          return new Map(state)
        })
        setItemsHidden(state=> {
          state.clear()
          itemsHiddenFilter.filter(([_, value])=> value.notification?(value.status === ApplicationStatus.Rejected && value.type === ProposalRequestType.Interview):value.status === ApplicationStatus.Rejected)
          .map(([app, vc])=>{
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
        {filtered.size + itemsHidden.size > 0 &&
        <p className={styles.itemsCounter}>
          {filtered.size + itemsHidden.size} {Formatter.pluralize((filtered.size + itemsHidden.size), 'отклик', 'отклика', 'откликов')}
        </p>
        }
        {itemsHidden.size > 0 &&
          <div className={styles.unavailable}>
            <p className={styles.counter}>
              {itemsHidden.size} {Formatter.pluralize((filtered.size + itemsHidden.size), 'отклик', 'отклика', 'откликов')} недоступно
            </p>
            <p className={styles.descriptions}>Соискатель скрыл или удалил свое резюме</p>
          </div>
        }
        {
          filtered.size > 0 && !loading && [...filtered.entries()].map(([id, proposal])=> {
            return (<VacancyItem  onRemove={(id)=>onRemove(id)} vc={proposal.vacancy} proposal={proposal} refreshCallback={feedBackContext.setCVResponses}/>)
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