import styles from './index.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useCvContext } from 'context/cv_state'
import useThrottleFn from '@react-cmpt/use-throttle/lib/useThrottleFn'
import Spacer from 'components/ui/Spacer'
import Filters from '../Filters'
import Spinner from 'components/ui/Spinner'
import VacancyRepository from 'data/repositories/VacancyRepository'
import { IVacancy } from 'data/interfaces/IVacancy'
import CvItem from 'components/ui/CvItem'
import hirer from 'images/recruiting/vacancy_back.jpg'
import { useAppContext } from 'context/state'
import TitleForSection from 'components/ui/TitleForSection'
import { useRouter } from 'next/router'
import { IRecruitingFiltersModalProps } from 'components/modals/RecruitingFiltersModal'
import { ModalType } from 'types/enums'
import InfiniteScroll from 'react-infinite-scroll-component'
import { IVacancyCvSearchParams } from 'data/interfaces/Common'
import P from '@/components/ui/P'
import MainSearchBar from '@/components/ui/MainSearchBar'
import StickyBox from 'react-sticky-box'
import SideFilters from '../SideFilters'
import { clearObject } from 'utils/helpers'
import { useLocationContext } from 'context/location_state'


interface Props {
  vcId: number  
  filters: Partial<IVacancyCvSearchParams>

}


export default function RecruitingPageHirer(props: Props) {
  const cvContext = useCvContext()
  const [loading, setLoading] = useState<boolean>(true)
  const currentFilters = useRef<IVacancyCvSearchParams>(props.filters||{})
  const currentVacancy = useRef<IVacancy>()
  const categories = useRef<number[]>([])
  const appContext = useAppContext()
  const router = useRouter()
  const [page, setPage] = useState<'filters' | 'cvs'>('cvs')
  const locationContext = useLocationContext()

  const {isTabletWidth} = appContext.size

  const findCvs = (data?: IVacancyCvSearchParams):void => {
    categories.current&&data&&(data.categories = categories.current)
    const clearedFilters:IVacancyCvSearchParams = {
      ...data,
      ...currentFilters.current,
      salaryMin: Number(data?.salaryMin?.toString().replaceAll(' ', '')) || Number(currentFilters.current?.salaryMin?.toString().replaceAll(' ', ''))||null,
      salaryMax: Number(data?.salaryMax?.toString().replaceAll(' ', '')) || Number(currentFilters.current?.salaryMax?.toString().replaceAll(' ', ''))||null
    }
    cvContext.findCvs(clearedFilters)
    .then(_=>setLoading(false))
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

  const findVacanciesThrottle = useThrottleFn(findCvs, 1000)

  const onFilterChange =(data: any) => {
    debugger
    setPage('cvs')
    cvContext.setPage(1)
    setLoading(true)
    currentFilters.current = data
    findVacanciesThrottle.callback(data)
    const clearedObj = clearObject({...currentFilters.current})
    router.replace({query: {filters: JSON.stringify(clearedObj) }}, undefined, {shallow: true})
  }

  useEffect(()=>{
    findCvs()  
  }, [cvContext.page])

  const init = async() => {
    const vc = props.vcId> 0?await VacancyRepository.getVacancyById(props.vcId):null
    categories.current = vc&&vc.categories.map(e=> e.id)
    currentVacancy.current = vc
    cvContext.foundCvs?.size === 0 && cvContext.findCvs()
    .then(_=>setLoading(false))
    cvContext.foundCvs?.size > 0 &&setLoading(false)
  }

  useEffect(()=>{
    init()
  }, [])

  useEffect(()=>{
  }, [cvContext.foundCvs])

  if(page === 'filters'){
    return <Filters onFilterChange={onFilterChange} initialFields={currentFilters.current}/>
  }

  return (<div className={styles.root}> 
    {!isTabletWidth &&
      <div className={styles.top}>
        <div className={styles.back}>
          <Image className={styles.backImage} src={hirer} alt={'rec image'} />
        </div>
        <P styleType={['huge', 'w700']}>
          Разместите вакансию в ArbiHunter
        </P>
        <P styleType={['large']} className={styles.description}>
          46% трудоспособного населения России — зарегистрированы на ArbiHunter        
        </P>
        <Link className={styles.createLink} href={'/create/vacancy'}>Разместить вакансию</Link>
      </div>
    }

    {isTabletWidth && 
      <TitleForSection title={' '} onBackClick={router.back}/>
    }
    <MainSearchBar
     placeholder={'Поиск резюме'} fullWidth className={styles.searchBar} 
     onChange={(s)=>onFilterChange({...currentFilters, search: s})}
     onFilterClick={onFilterClick}/>

    <div className={styles.header}>
      {!loading &&
        <P 
        styleType={['huge', 'w600']} 
        className={styles.found}
        >
          Найдено {cvContext.total} резюме {props.vcId?'на вакансию '+ currentVacancy.current.name:''}
        </P>
        ||
        <Spacer basis={88}/>
      }
    </div>
  
    <div className={styles.content}>
      {!isTabletWidth &&
        <StickyBox className={styles.filters}  offsetTop={100} offsetBottom={20}>
          <div className={styles.filter}>
            <SideFilters onFilterChange={onFilterChange} initialFields={currentFilters.current}/>
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
                return <CvItem cv={cv} initialVacancy={currentVacancy.current} onChangeItem={()=> findCvs()}/>
              })
              ||
              !loading && <p className='empty'>Нет найденных вакансий</p>
            }
          </div>
        </InfiniteScroll>
      </div>
    </div>
    </div>)
  }

  // {!isTabletWidth &&
  //   <StickyBox className={styles.filters}  offsetTop={100} offsetBottom={20}>
  //     <div className={styles.filter}>
  //       <Filters onFilterChange={onFilterChange}/>
  //     </div>
  //   </StickyBox>
  // }
