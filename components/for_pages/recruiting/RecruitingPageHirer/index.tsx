import styles from './index.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import SearchBar from 'components/ui/SearchBar'
import { useEffect, useRef, useState } from 'react'
import { useCvContext } from 'context/cv_state'
import useThrottleFn from '@react-cmpt/use-throttle/lib/useThrottleFn'
import Spacer from 'components/ui/Spacer'
import Filters from '../Filters'
import Spinner from 'components/ui/Spinner'
import VacancyRepository from 'data/repositories/VacancyRepository'
import { IVacancy } from 'data/interfaces/IVacancy'
import CvItem from 'components/ui/CvItem'
import { CharacterWrapper } from 'context/character_state'
import StickyBox from 'react-sticky-box'
import hirer from 'images/recruiting/vacancy_back.jpg'
import { useAppContext } from 'context/state'
import TitleForSection from 'components/ui/TitleForSection'
import { useRouter } from 'next/navigation'
import { IRecruitingFiltersModalProps } from 'components/modals/RecruitingFiltersModal'
import { ModalType } from 'types/enums'


interface Props {
  vcId: number
}

export default function RecruitingPageHirer(props: Props) {
  const [loading, setLoading] = useState<boolean>(true)
  const cvContext = useCvContext()
  const [currentFilters, setCurrentFilters] = useState<any>({})
  const currentVacancy = useRef<IVacancy>()
  const categories = useRef<number[]>([])
  const appContext = useAppContext()
  const router = useRouter()


  const {isTabletWidth} = appContext.size


  const findCvs = (data: any):void => {
    categories.current&&(data.categories = categories.current)
    cvContext.findCvs(data)
    .then(_=>setLoading(false))
  }

  const onFilterClick = ()=>{
    appContext.showModal<IRecruitingFiltersModalProps>(ModalType.RecruitingFiltersModal, {
      onFilterChange: (data)=>onFilterChange(data)
    })
  }

  const findVacanciesThrottle = useThrottleFn(findCvs, 1000)

  const onFilterChange =(data: any) => {
    setLoading(true)
    setCurrentFilters(data)
    findVacanciesThrottle.callback(data)
  }

  const init = async() => {
    const vc = props.vcId> 0?await VacancyRepository.getVacancyById(props.vcId):null
    categories.current = vc&&vc.categories.map(e=> e.id)
    currentVacancy.current = vc
    cvContext.foundCvs.length === 0 && cvContext.findCvs()
    .then(_=>setLoading(false))
    cvContext.foundCvs.length > 0 &&setLoading(false)
  }

  useEffect(()=>{
    init()
  }, [])

  return (<div className={styles.root}> 
    {!isTabletWidth &&
      <div className={styles.top}>
        <div className={styles.back}>
          <Image className={styles.backImage} src={hirer} alt={'rec image'} />
        </div>
        <p className={styles.title}>Найти работу в ArbiHunter</p>
        <p className={styles.description}>
          Ежедневно более 1000 людей находят работу в&nbsp;ArbiHunter <br/> которая позволяет им&nbsp;расти и&nbsp;становиться успешными!    
        </p>
        <Link className={styles.createLink} href={'/create/vacancy'}>Разместить вакансию</Link>
      </div>
    }

    {isTabletWidth && 
      <TitleForSection title={' '} onBackClick={router.back}/>
    }
    <SearchBar placeholder={'Поиск резюме'} fullWidth className={styles.searchBar} 
    onChange={(s)=>onFilterChange({...currentFilters, search: s})}
    onFilterClick={onFilterClick}
    />
    {!loading &&
      <p className={styles.found}>Найдено {cvContext.foundCvs.length} резюме {props.vcId?'на вакансию '+ currentVacancy.current.name:''}</p>
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
        {loading &&
          <Spinner size={24} />
          ||
          !loading && cvContext.foundCvs?.length > 0 && cvContext.foundCvs?.map(cv=> {
            return <CharacterWrapper><CvItem cv={cv} initialVacancy={currentVacancy.current} onChangeItem={()=> findCvs(currentFilters)}/></CharacterWrapper>
          })
          ||
          <p className='empty'>Нет найденных вакансий</p>
        }
      </div>
    </div>
    </div>)
  }
