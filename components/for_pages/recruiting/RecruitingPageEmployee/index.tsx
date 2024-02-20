import styles from './index.module.scss'

import Link from 'next/link'
import { VacancyWrapper, useVacancyContext } from 'context/vacancy_state'
import { useEffect, useRef, useState } from 'react'
import Formatter from 'utils/formatter'
import Spacer from 'components/ui/Spacer'
import { useThrottleFn } from '@react-cmpt/use-throttle'
import { IVacancyCvSearchParams } from 'data/interfaces/Common'
import React from 'react'
import StickyBox from 'react-sticky-box'
import { useAppContext } from 'context/state'
import { IRecruitingFiltersModalProps } from 'components/modals/RecruitingFiltersModal'
import { ModalType, SearchIn } from 'types/enums'
import TitleForSection from 'components/ui/TitleForSection'
import { useRouter } from 'next/router'
import Image from 'next/image'
import employee from 'images/recruiting/job_back.jpg'
import Spinner from 'components/ui/Spinner'
import VacancyItem from 'components/ui/VacancyItem'
import InfiniteScroll from 'react-infinite-scroll-component'
import MainSearchBar from '@/components/ui/MainSearchBar'
import SideFilterEmployee from '../SideFilters/SideFilterEmployee'
import FilterEmployee from '../Filters/FilterEmployee'
import { clearObject } from 'utils/helpers'

interface Props {
  filters: Partial<IVacancyCvSearchParams>
}

export default function RecruitingPageEmployee(props: Props) {
  return (
    <VacancyWrapper>
      <RecruitingPageEmployeeInner {...props}/>
    </VacancyWrapper>
  )
}

function RecruitingPageEmployeeInner(props: Props) {
  const router = useRouter()
  const vacancyContext = useVacancyContext()
  const appContext = useAppContext()

  const {isTabletWidth} = appContext.size
  const isInited = useRef<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [currentFilters, setCurrentFilters] = useState<IVacancyCvSearchParams>(props.filters||{})
  const [page, setPage] = useState<'filters' | 'vacancies'>('vacancies')
  const [searchString, setSearchString] = useState<string>(props?.filters?.search||'')


  const findVacancies = (data?: IVacancyCvSearchParams):void => {
    vacancyContext.findVacancies(currentFilters)
    .then(_=>setLoading(false))
  }

  const findVacanciesThrottle = useThrottleFn(findVacancies, 1000)

  const onFilterChange =(data: IVacancyCvSearchParams) => {
    const dataToSend = {...data}
    switch (dataToSend.searchIn) {
      case SearchIn.Name:
        dataToSend.search = dataToSend.keywords + ' ' + dataToSend.search
        break
      case SearchIn.Company:
        dataToSend.searchCompany = dataToSend.keywords + ' ' + dataToSend.searchCompany
        break
      default: 
        dataToSend.search = dataToSend.keywords + ' ' + dataToSend.search

    }

    setPage('vacancies')
    setLoading(true)
    vacancyContext.setPage(1)
    setCurrentFilters(dataToSend)
    findVacanciesThrottle.callback(currentFilters)
    const clearedObj = clearObject({...dataToSend})
    router.replace({query: {filters: JSON.stringify(clearedObj) }}, undefined, {shallow: true})
  }

  const onFilterClick = ()=>{
    if(!isTabletWidth) {
      setPage('filters')
      return 
    }
    appContext.showModal<IRecruitingFiltersModalProps>(ModalType.RecruitingFiltersModal, {
      onFilterChange: (data)=>onFilterChange(data)
    })
  }

  useEffect(()=>{
    setTimeout(()=>{
      isInited.current = true      
    }, 200)
  }, [])



  useEffect(()=>{
    isInited.current && findVacancies()  
  }, [vacancyContext.page])


  if(page === 'filters') {
    return <FilterEmployee onFilterChange={onFilterChange} initialFields={currentFilters}/>
  }

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

  <MainSearchBar placeholder={'Поиск вакансий'} fullWidth className={styles.searchBar} 
  onChange={(s)=>onFilterChange({...currentFilters,  ...s})}
  onFilterClick={onFilterClick}
  initialSearch={searchString}

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
          <SideFilterEmployee onFilterChange={onFilterChange} initialFields={currentFilters}/>
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