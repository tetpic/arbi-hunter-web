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
import { SearchIn } from 'types/enums'
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
import { CvWrapper, useCvContext } from 'context/cv_state'
import useTranslation from 'next-translate/useTranslation'
import P from '@/components/ui/P'

interface Props {
  filters: Partial<IVacancyCvSearchParams>
}

export default function RecruitingPageEmployee(props: Props) {
  return (
    <VacancyWrapper>
    <CvWrapper>
      <RecruitingPageEmployeeInner {...props}/>
    </CvWrapper>
    </VacancyWrapper>
  )
}

function RecruitingPageEmployeeInner(props: Props) {
  const {t} = useTranslation()
  const router = useRouter()
  const vacancyContext = useVacancyContext()
  const appContext = useAppContext()
  const cvContext = useCvContext()

  const {isTabletWidth} = appContext.size
  const isInited = useRef<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [currentFilters, setCurrentFilters] = useState<IVacancyCvSearchParams>(props.filters||{})
  const [page, setPage] = useState<'filters' | 'vacancies'>('vacancies')


  const findVacancies = (data?: IVacancyCvSearchParams):void => {
    
    vacancyContext.findVacancies(currentFilters)
    .then(_=>setLoading(false))
  }

  const findVacanciesThrottle = useThrottleFn(findVacancies, 1000)

  const onFilterChange =(data: IVacancyCvSearchParams) => {
    
    const dataToSend = {...data}
    switch (dataToSend.searchIn) {
      case SearchIn.Name:
        dataToSend.search = [dataToSend.keywords, dataToSend.search].filter(Boolean).join(' ')
        break
      case SearchIn.Company:
        dataToSend.searchCompany = [dataToSend.keywords, dataToSend.searchCompany].filter(Boolean).join(' ')
        break
      default: 
        dataToSend.search = [dataToSend.keywords, dataToSend.search].filter(Boolean).join(' ')
    }

    const clearedObj = clearObject({...dataToSend})
    setPage('vacancies')
    setLoading(true)
    vacancyContext.setPage(1)
    setCurrentFilters(clearedObj)
    setTimeout(()=>{
      findVacanciesThrottle.callback(clearedObj)
    }, 100)
    router.replace({query: {filters: JSON.stringify(clearedObj) }}, undefined, {shallow: true})
  }

  const onFilterClick = ()=>{
    // if(!isTabletWidth) {
      setPage('filters')
    //   return 
    // }
    // appContext.showModal<IRecruitingFiltersModalProps>(ModalType.RecruitingFiltersModal, {
    //   onFilterChange: (data)=>onFilterChange(data)
    // })
  }

  useEffect(()=>{
    cvContext.setSavedCvs()
    setTimeout(()=>{
      isInited.current = true      
    }, 200)
  }, [])



  useEffect(()=>{    
    findVacancies()  
  }, [vacancyContext.page])


  if(page === 'filters') {
    return <FilterEmployee onFilterChange={onFilterChange} initialFields={currentFilters} onCancel={()=>setPage('vacancies')}/>
  }

  return (<div className={styles.root}> 
  {!isTabletWidth &&
    <div className={styles.top}>
      <div className={styles.back}>
        <Image src={employee} className={styles.backImage} alt={'back'} />
      </div>
      <P styleType={['huge', 'w700']} useThemeColor className={styles.title}>{t('recruiting_em_placeCv')}</P>
      <P styleType={['large']} useThemeColor  className={styles.description}>
        {t('recruiting_em_desc1')} <br/> {t('recruiting_em_desc2')}    
      </P>
      <Link className={styles.createLink} href={'/create/cv'}>{t('create_cv')}</Link>
    </div>
  }

  <div className={styles.searchBarWrapper}>
  {isTabletWidth && 
    <TitleForSection title={' '} onBackClick={router.back} className={styles.title}/>
  }
  <MainSearchBar placeholder={t('recruiting_em_searchVcs')} fullWidth className={styles.searchBar} 
  onChange={(s)=>onFilterChange({...currentFilters,  ...s})}
  onFilterClick={onFilterClick}
  initialSearch= {currentFilters.search}
  />
  </div>
  {!loading &&
    <P styleType={['huge', 'w600']} useThemeColor className={styles.found}>{t('found')} {vacancyContext.total} {Formatter.pluralize(vacancyContext.total, t('vacancies1'), t('vacancies2'), t('vacancies3'))}</P>
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
            return <VacancyItem smallCard={isTabletWidth} 
            vacancy={vacancy}  
            onChangeItem={(v)=>{
              vacancyContext.refreshVacancyInFound(v)
              // findVacancies()}
            }}
            />
          })
          ||
          <P useThemeColor className='empty'>{t('recruiting_em_noFoundVacancies')}</P>
        }
      </div>
      </InfiniteScroll>
      {/* <PageVacancies filters={currentFilters.current} onChange={findVacancies} loading={loading} vacancies={vacancyContext.foundVacancies}/> */}
    </div>
  </div>
  </div>)
}