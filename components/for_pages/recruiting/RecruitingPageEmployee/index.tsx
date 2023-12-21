import styles from './index.module.scss'

import SearchBar from 'components/ui/SearchBar'
import Link from 'next/link'
import { useVacancyContext } from 'context/vacancy_state'
import { useEffect, useMemo, useState } from 'react'
import Formatter from 'utils/formatter'
import Filters from '../Filters'
import Spacer from 'components/ui/Spacer'
import { useThrottleFn } from '@react-cmpt/use-throttle'
import { useCvContext } from 'context/cv_state'
import { IVacancyCvSearchParams } from 'data/interfaces/Common'
import Rive from '@rive-app/react-canvas'
import PageVacancies from './PageVacancies'
import React from 'react'
import StickyBox from 'react-sticky-box'
import { useAppContext } from 'context/state'
import { IRecruitingFiltersModalProps } from 'components/modals/RecruitingFiltersModal'
import { ModalType } from 'types/enums'
import TitleForSection from 'components/ui/TitleForSection'
import { useRouter } from 'next/navigation'



export default function RecruitingPageEmployee() {
  const router = useRouter()
  const vacancyContext = useVacancyContext()
  const cvContext = useCvContext()
  const appContext = useAppContext()

  const {isTabletWidth} = appContext.size
  const [loading, setLoading] = useState<boolean>(true)
  const [currentFilters, setCurrentFilters] = useState<IVacancyCvSearchParams>({})

  const findVacancies = (data: IVacancyCvSearchParams):void => {
    vacancyContext.findVacancies(data)
    .then(_=>setLoading(false))
  }

  const findVacanciesThrottle = useThrottleFn(findVacancies, 1000)

  const onFilterChange =(data: IVacancyCvSearchParams) => {
    setLoading(true)
    setCurrentFilters(data)
    findVacanciesThrottle.callback(data)
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

  const memoedRive = useMemo(()=><Rive 
  key={1}
  src={'/rive/cv_laptop.riv'} 
  animations={[   
    'Money3',
    'Money2',
    'Money1',
    'MoneyLoop',
    'Laptop',
    'HandR',
    'HandL',
    'Head',
    'Eyes',
    'Boot',]} 
  className={styles.image}/>, [])

  return (<div className={styles.root}> 
  {!isTabletWidth &&
    <div className={styles.top}>
      <div className={styles.back}></div>
      {memoedRive}
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
  onChange={(s)=>onFilterChange({...currentFilters,  ...s})}
  onFilterClick={onFilterClick}
  />
  {!loading &&
    <p className={styles.found}>Найдено {vacancyContext.foundVacancies.length} {Formatter.pluralize(vacancyContext.foundVacancies.length, 'вакансия', 'вакансии', 'вакансий')}</p>
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
      <PageVacancies filters={currentFilters} onChange={findVacancies} loading={loading} vacancies={vacancyContext.foundVacancies}/>
    </div>
  </div>
  </div>)
}