import styles from './index.module.scss'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useCvContext } from 'context/cv_state'
import useThrottleFn from '@react-cmpt/use-throttle/lib/useThrottleFn'
import Spacer from 'components/ui/Spacer'
import Spinner from 'components/ui/Spinner'
import CvItem from 'components/ui/CvItem'
import hirer from 'images/recruiting/vacancy_back.jpg'
import { useAppContext } from 'context/state'
import TitleForSection from 'components/ui/TitleForSection'
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component'
import { IVacancyCvSearchParams } from 'data/interfaces/Common'
import P from '@/components/ui/P'
import MainSearchBar from '@/components/ui/MainSearchBar'
import StickyBox from 'react-sticky-box'
import { clearObject } from 'utils/helpers'
import FilterHirer from '../Filters/FilterHirer'
import SideFilterHirer from '../SideFilters/SideFilterHirer'
import { VacancyWrapper, useVacancyContext } from 'context/vacancy_state'
import useTranslation from 'next-translate/useTranslation'


interface Props {
  vcId?: number  
  category?: number
  filters: Partial<IVacancyCvSearchParams>
}

export default function RecruitingPageHirer(props: Props) {

  return (
    <VacancyWrapper>
      <RecruitingPageHirerInner {...props}/>
    </VacancyWrapper>
  )
}



function RecruitingPageHirerInner(props: Props) {
  const {t} = useTranslation()
  const cvContext = useCvContext()
  const vacancyContext = useVacancyContext()
  const [loading, setLoading] = useState<boolean>(true)
  const [currentFilters, setCurrentFilters] = useState<Partial<IVacancyCvSearchParams>>(props.filters||{})
  const appContext = useAppContext()
  const router = useRouter()
  const [page, setPage] = useState<'filters' | 'cvs'>('cvs')
  const isInited = useRef<boolean>(false)
  const [searchString, setSearchString] = useState<string>(props?.filters?.search||'')

  const {isTabletWidth} = appContext.size

  const findCvs = (data?: IVacancyCvSearchParams):void => {
    const _filters:IVacancyCvSearchParams = {
      ...currentFilters,
      ...data,
      salaryMin: Number(data?.salaryMin?.toString().replaceAll(' ', '')) || Number(currentFilters?.salaryMin?.toString().replaceAll(' ', ''))||null,
      salaryMax: Number(data?.salaryMax?.toString().replaceAll(' ', '')) || Number(currentFilters?.salaryMax?.toString().replaceAll(' ', ''))||null
    }
    const clearedFilters = clearObject({..._filters})
    cvContext.findCvs(clearedFilters)
    .then(_=>setLoading(false))
  }

  const onFilterClick = ()=>{
    setPage('filters')
  }

  const findVacanciesThrottle = useThrottleFn(findCvs, 1000)

  const onFilterChange =(data: any) => {
    const clearedObj = clearObject({...data})
    setPage('cvs')
    cvContext.setPage(1)
    setLoading(true)
    setSearchString(data.search)
    setCurrentFilters(clearedObj)
    findVacanciesThrottle.callback(clearedObj)
    router.replace({query: {filters: JSON.stringify(clearedObj) }}, undefined, {shallow: true})
  }

  const init = async() => {
    vacancyContext.setVacancies()
    if(props.vcId) {
      vacancyContext.setCurrentVacancy({id: props.vcId})
    }
    setTimeout(()=>{
      isInited.current = true      
    }, 200)
  }

  useEffect(()=>{
    init()
  }, [])

  useEffect(()=>{
    findCvs()  
  }, [cvContext.page])

  if(page === 'filters'){
    return <FilterHirer onFilterChange={onFilterChange} onCancel={()=>setPage('cvs')} initialFields={currentFilters}/>
  }

  return (<div className={styles.root}> 
    {!isTabletWidth &&
      <div className={styles.top}>
        <div className={styles.back}>
          <Image className={styles.backImage} src={hirer} alt={'rec image'} />
        </div>
        <P styleType={['huge', 'w700']} useThemeColor>
          {t('recruiting_hir_placeVacancy')}
        </P>
        <P styleType={['large']} className={styles.description} useThemeColor>
          {t('recruiting_hir_description')}        
        </P>
        <Link className={styles.createLink} href={'/create/vacancy'}>{t('recruiting_hir_toPlaceVacancy')}</Link>
      </div>
    }

    {isTabletWidth && 
      <TitleForSection title={' '} onBackClick={router.back}/>
    }
    <MainSearchBar
     placeholder={t('search_cv')} fullWidth className={styles.searchBar} 
     onChange={(s)=>onFilterChange({...currentFilters, search: s.search})}
     initialSearch={searchString}
     onFilterClick={onFilterClick}
     />

    <div className={styles.header}>
      {!loading &&
        <P 
        styleType={['huge', 'w600']} 
        className={styles.found}
        useThemeColor
        >
          {t('found')} {cvContext.total} {t('cv').toLowerCase()} {props.vcId?t('recruiting_hit_foundOnVacancy')+' '+ vacancyContext.currentVacancy.name:''}
        </P>
        ||
        <Spacer basis={88}/>
      }
    </div>
  
    <div className={styles.content}>
      {!isTabletWidth &&
        <StickyBox className={styles.filters}  offsetTop={100} offsetBottom={20}>
          <div className={styles.filter}>
            <SideFilterHirer onFilterChange={onFilterChange} initialFields={currentFilters}/>
          </div>
        </StickyBox>
      }
      <div className={styles.vacancies}>
        <InfiniteScroll 
        next={()=>{cvContext.setPage(p=> p+1)}} 
        hasMore={cvContext.foundCvs?.size < cvContext.total} 
        loader={<Spinner size={24}/>} 
        dataLength={cvContext.foundCvs?.size + 1}>
          <div className={styles.vacanciesWrapper}>
            {loading && <Spinner size={24}/>
              ||
              !loading && cvContext.foundCvs?.size > 0 && [...cvContext.foundCvs.values()].map(cv=> {
                return <CvItem cv={cv} initialVacancy={vacancyContext.currentVacancy} key={cv.id} onChangeItem={()=> findCvs()}/>
              })
              ||
              !loading && <P useThemeColor className='empty'>{t('recruiting_noFoundCvs')}</P>
            }
          </div>
        </InfiniteScroll>
      </div>
    </div>
    </div>)
  }
