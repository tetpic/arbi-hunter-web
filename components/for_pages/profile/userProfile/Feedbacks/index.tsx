import styles from './index.module.scss'

import { useFeedbacksContext } from 'context/feedbacks_state'
import { useEffect, useState } from 'react'
import { ApplicationStatus, ProposalRequestType } from 'types/enums'
import VacancyItem from '../Saved/Vacancies/VacancyItem'
import { IProposal } from 'data/interfaces/IProposal'
import Spinner from 'components/ui/Spinner'
import Formatter from 'utils/formatter'
import ItemNavigation from '@/components/ui/ItemNavigation'
import useTranslation from 'next-translate/useTranslation'
import { Translate } from 'next-translate'
import P from '@/components/ui/P'
import { IApplication } from 'data/interfaces/IApplication'

enum ReviewsNavigation {
  Any = 'any',
  Invite = 'invite',
  Wait = 'wait',
  Reject = 'reject',
  Archive = 'archive'
}

function translate (n: ReviewsNavigation, t:Translate) {
  switch(n) {
    case ReviewsNavigation.Any:
      return t('profile_feedbacks_all')
    case ReviewsNavigation.Invite:
      return t('profile_feedbacks_invite')
    case ReviewsNavigation.Wait:
      return t('profile_feedbacks_paused')
    case ReviewsNavigation.Reject:
      return t('profile_feedbacks_reject')
    case ReviewsNavigation.Archive:
      return t('profile_feedbacks_archive')
  }
}

export default function Feedbacks() {
  const {t} = useTranslation()
  const feedBackContext = useFeedbacksContext()
  const {CVFeedbacks} = feedBackContext

  const [page, setPage] = useState<ReviewsNavigation>(ReviewsNavigation.Any)
  const items = Object.values(ReviewsNavigation).map(el=> {return {name: translate(el, t), type: el}})
  const [filtered, setFiltered] = useState<Map<number, IProposal|IApplication>>(CVFeedbacks)
  const [loading, setLoading] = useState<boolean>(true)
  const [itemsHidden, setItemsHidden] = useState<Map<number, IProposal|IApplication>>(new Map)

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
    const cvEntries:[number, IProposal|IApplication][] = [...CVFeedbacks.entries()]
    
    const itemsActiveFilter = cvEntries.filter(([key, value]) => !value.vacancyDeletedOrHidden&&!value.deletedByEmployee)
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
          itemsActiveFilter.filter(([_, value])=> value.status==='accepted')
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
          itemsActiveFilter.filter(([_, value])=> value.status==='applied')
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

        case ReviewsNavigation.Archive:
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
        {filtered.size > 0 &&
        <p className={styles.itemsCounter}>
          {filtered.size} {Formatter.pluralize((filtered.size), t('feedbackCount1'), t('feedbackCount2'), t('feedbackCount3'))}
        </p>
        }
        {/* {itemsHidden.size > 0 &&
          <div className={styles.unavailable}>
            <p className={styles.counter}>
              {itemsHidden.size} {Formatter.pluralize((filtered.size + itemsHidden.size), t('feedbackCount1'), t('feedbackCount2'), t('feedbackCount3'))} {t('unavailable')}
            </p>
            <p className={styles.descriptions}>{t('profile_feedbacks_hideReason_emp')}</p>
          </div>
        } */}
        {
          filtered.size > 0 && !loading && [...filtered.entries()].map(([id, item])=> {
            return (<VacancyItem  onRemove={(id)=>onRemove(id)} vc={item.vacancy} item={item} refreshCallback={feedBackContext.setCVResponses}/>)
          })
          ||
          loading &&
          <Spinner size={24}/>
          ||
          <P useThemeColor className={'empty'}>{t('profile_feedbacks_noFeed')}</P>
        }
      </div>
    </div>)
}