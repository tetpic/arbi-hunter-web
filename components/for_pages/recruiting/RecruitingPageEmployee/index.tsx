import styles from './index.module.scss'

import SearchBar from 'components/ui/SearchBar'
import Link from 'next/link'
import { useVacancyContext } from 'context/vacancy_state'
import { useEffect,  useRef,  useState } from 'react'
import Formatter from 'utils/formatter'
import Filters from '../Filters'
import Spacer from 'components/ui/Spacer'
import { useThrottleFn } from '@react-cmpt/use-throttle'
import { useCvContext } from 'context/cv_state'
import { IVacancyCvSearchParams } from 'data/interfaces/Common'
import React from 'react'
import StickyBox from 'react-sticky-box'
import { useAppContext } from 'context/state'
import { IRecruitingFiltersModalProps } from 'components/modals/RecruitingFiltersModal'
import { ModalType } from 'types/enums'
import TitleForSection from 'components/ui/TitleForSection'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import employee from 'images/recruiting/job_back.jpg'
import Spinner from 'components/ui/Spinner'
import VacancyItem from 'components/ui/VacancyItem'
import InfiniteScroll from 'react-infinite-scroll-component'



export default function RecruitingPageEmployee() {
  const router = useRouter()
  const vacancyContext = useVacancyContext()
  const cvContext = useCvContext()
  const appContext = useAppContext()

  const {isTabletWidth} = appContext.size
  const [loading, setLoading] = useState<boolean>(true)
  const currentFilters = useRef<IVacancyCvSearchParams>({})

  const findVacancies = (data?: IVacancyCvSearchParams):void => {
    vacancyContext.findVacancies(currentFilters.current)
    .then(_=>setLoading(false))
  }

  const findVacanciesThrottle = useThrottleFn(findVacancies, 1000)

  const onFilterChange =(data: IVacancyCvSearchParams) => {
    setLoading(true)
    vacancyContext.setPage(1)
    currentFilters.current = data
    findVacanciesThrottle.callback(currentFilters.current)
  }

  useEffect(()=>{
    vacancyContext.findVacancies()
    .then(_=>{
      setLoading(false)
    })
    cvContext.setSavedCvs()
  }, [])

  const onFilterClick = ()=>{
    appContext.showModal<IRecruitingFiltersModalProps>(ModalType.RecruitingFiltersModal, {
      onFilterChange: (data)=>onFilterChange(data)
    })
  }

  useEffect(()=>{
    findVacancies()  
  }, [vacancyContext.page])

  return (<div className={styles.root}> 
  {!isTabletWidth &&
    <div className={styles.top}>
      <div className={styles.back}>
        <Image src={employee} className={styles.backImage} alt={'back'} />
      </div>
      <p className={styles.title}>Найти работу в ArbiHunter</p>
      <p className={styles.description}>
        Ежедневно более 1000 людей находят работу в&nbsp;ArbiHunter <br/> которая позволяет им&nbsp;расти и&nbsp;становиться успешными!    
      </p>
      <Link className={styles.createLink} href={'/create/cv'}>Создать резюме</Link>
    </div>
  }
  {isTabletWidth && 
  <TitleForSection title={' '} onBackClick={router.back}/>
  }

  <SearchBar placeholder={'Поиск вакансий'} fullWidth className={styles.searchBar} 
  onChange={(s)=>onFilterChange({...currentFilters.current,  ...s})}
  onFilterClick={isTabletWidth&&onFilterClick}
  />
  {!loading &&
    <p className={styles.found}>Найдено {vacancyContext.total} {Formatter.pluralize(vacancyContext.total, 'вакансия', 'вакансии', 'вакансий')}</p>
    ||
    <Spacer basis={88}/>
  }

  <div className={styles.content}>
    {!isTabletWidth &&
      <StickyBox className={styles.filters}  offsetTop={100} offsetBottom={20}>
        <div className={styles.filter}>
          <Filters onFilterChange={onFilterChange}/>
        </div>
      </StickyBox>
    }

    <div className={styles.vacancies}>
      <InfiniteScroll 
      next={()=>{
        vacancyContext.setPage(p=> p+1)
      }} 
      hasMore={vacancyContext.foundVacancies?.size < vacancyContext.total} 
      loader={<Spinner size={24}/>} 
      dataLength={vacancyContext.foundVacancies?.size + 1}>
      <div className={styles.vacanciesWrapper}>
        {loading &&
          <Spinner size={24} />
          ||
          !loading && vacancyContext.foundVacancies?.size > 0 && [...vacancyContext.foundVacancies.values()].map(vacancy=> {
            return <VacancyItem vacancy={vacancy} onChangeItem={()=>findVacancies()}/>
          })
          ||
          <p className='empty'>Нет найденных вакансий</p>
        }
      </div>
      </InfiniteScroll>
      {/* <PageVacancies filters={currentFilters.current} onChange={findVacancies} loading={loading} vacancies={vacancyContext.foundVacancies}/> */}
    </div>
  </div>
  </div>)
}