import styles from './index.module.scss'

import { useAppContext } from 'context/state'
import Title from '@/components/ui/TitleForSection'
import P from '@/components/ui/P'
import { useEffect, useState } from 'react'
import { IVacancy } from 'data/interfaces/IVacancy'
import { ICV } from 'data/interfaces/ICV'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import CvRepository from 'data/repositories/CvRepository'
import VacancyRepository from 'data/repositories/VacancyRepository'
import InfiniteScroll from 'react-infinite-scroll-component'
import Spinner from '@/components/ui/Spinner'
import CvItem from '@/components/ui/CvItem'
import FavoritesVacancyItem from './FavoritesVacancyItem'
import Formatter from 'utils/formatter'

interface Props {
}

export default function FavoritesPage(props: Props) {
  const appContext = useAppContext()
  const userContext = useUserContext()
  const [vacancies, setVacancies] = useState<Map<number, IVacancy>>(new Map)
  const [cvs, setCvs] = useState<Map<number, ICV>>(new Map)
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const profileType = userContext.currentProfile.profileType


  const getItems = () => {
    if(profileType === ProfileType.Hirer) {
      CvRepository.findCvs({savedByCurrentProfile: true}, page, 10)
      .then(res=>{
        if(res) {
          setCvs(state=>{
            res.data.forEach(el=>state.set(el.id, el))
            return new Map(state)
          })
          setTotal(res.total)
        }
      })
    }
    else if(profileType=== ProfileType.Employee) {
      VacancyRepository.getSavedFromCurrentProfile(page, 10)
      .then(res=> {
        if(res) {
          setVacancies(state=>{
            res.data.forEach(el=>state.set(el.id, el))
            return new Map(state)
          })
          setTotal(res.total)
        }
      })
    }
  }

  const onVacancyRemove = (id: number) => {
    VacancyRepository.removeVcFromSaved(id)
    .then(_=> {
      setVacancies(state=>{
        state.delete(id)
        return new Map(state)
      })
      setTotal(total-1)
    })
  }

  useEffect(()=>{
    getItems()
  }, [page])

  return (
    <div className={styles.root}>
      <Title title={'Избранное'}/>
      <div className={styles.top}>
        <P styleType={['medium', 'w500']}>Вакансии</P>
        <P styleType={['medium', 'w500']}>{total} {profileType === ProfileType.Employee?Formatter.pluralize(total, 'вакансия', 'вакансии', 'вакансий'):'резюме'}</P>
      </div>

      <InfiniteScroll 
      next={()=>setPage(page+1)} 
      hasMore={profileType === ProfileType.Hirer?cvs.size < total:vacancies.size < total}  
      loader={<Spinner size={24}/>} 
      dataLength={total}
      >
        {profileType === ProfileType.Hirer ?
          [...cvs.values()].map(el=> <CvItem key={el.id} cv={el} />)
          : [...vacancies.values()].map(el=> <FavoritesVacancyItem key={el.id} vacancy={el} onLikeClick={onVacancyRemove}/>)
        }
      </InfiniteScroll>
    </div>
  )
}