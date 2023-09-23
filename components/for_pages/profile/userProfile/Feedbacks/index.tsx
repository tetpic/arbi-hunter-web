import { useFeedbacksContext } from 'context/feedbacks_state'
import { IApplication } from 'data/interfaces/IApplication'
import { IVacancy } from 'data/interfaces/IVacancy'
import { useEffect, useState } from 'react'
import { ApplicationStatus } from 'types/enums'
import ItemNavigation from '../../ItemNavigation'
import VacancyItem from '../Saved/Vacancies/VacancyItem'
import styles from './index.module.scss'

interface Props {
}

enum ReviewsNavigation {
  Any = 'any',
  Invite = 'invite',
  Reject = 'reject',
}

function translate (n: ReviewsNavigation) {
  switch(n) {
    case ReviewsNavigation.Any:
      return 'Любые отклики'
    case ReviewsNavigation.Invite:
      return 'Приглашение'
    case ReviewsNavigation.Reject:
      return 'Отказ'
  }
}

export default function Feedbacks(props: Props) {

  const feedBackContext = useFeedbacksContext()
  const {CVFeedbacks} = feedBackContext

  const [page, setPage] = useState<ReviewsNavigation>(ReviewsNavigation.Any)
  const items = Object.values(ReviewsNavigation).map(el=> {return {name: translate(el), type: el}})
  const [filtered, setFiltered] = useState<Map<IApplication, IVacancy>>(CVFeedbacks)

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
            [...CVFeedbacks.entries()].filter(([key, value])=> key.status === ApplicationStatus.Applied)
            .map(([app, vc])=>{
              state.set(app, vc)
            })
            return new Map(state)
        })
      break
      case ReviewsNavigation.Reject:
        setFiltered(state=> {
          state.clear();
          [...CVFeedbacks.entries()].filter(([key, value])=> key.status === ApplicationStatus.Rejected)
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
  }, [])

  return (
    <div className={styles.root}>
      <ItemNavigation activeItem={page} items={items} onClick={(n)=>setPage(n)} className={styles.navigation}/>
      <div className={styles.wrapper}>
        {
          filtered.size > 0 && [...filtered.entries()].map(([app, vc])=> {
            return (<VacancyItem vc={vc} application={app} refreshCallback={feedBackContext.setCVResponses}/>)
          })
          ||
          <p className={'empty'}>Нет откликов</p>
        }
      </div>
    </div>)
}