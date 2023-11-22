import styles from './index.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import hirerMain from 'images/recruiting/hirer_page_main.png'
import SearchBar from 'components/ui/SearchBar'
import { useEffect, useRef, useState } from 'react'
import { useCvContext } from 'context/cv_state'
import useThrottleFn from '@react-cmpt/use-throttle/lib/useThrottleFn'
import Spacer from 'components/ui/Spacer'
import Filters from '../Filters'
import Spinner from 'components/ui/Spinner'
import { colors } from 'styles/variables'
import CvItem from './CvItem'
import VacancyRepository from 'data/repositories/VacancyRepository'
import { IVacancy } from 'data/interfaces/IVacancy'

interface Props {
  vcId: number
}

export default function RecruitingPageHirer(props: Props) {
  const [loading, setLoading] = useState<boolean>(true)
  const cvContext = useCvContext()
  const [currentFilters, setCurrentFilters] = useState<any>({})
  const currentVacancy = useRef<IVacancy>()
  const categories = useRef<number[]>([])

  const findCvs = (data: any):void => {
    categories.current&&(data.categories = categories.current)
    cvContext.findCvs(data)
    .then(_=>setLoading(false))
  }

  const findVacanciesThrottle = useThrottleFn(findCvs, 1000)

  const onFilterChange =(data: any) => {
    setLoading(true)
    setCurrentFilters(data)
    findVacanciesThrottle.callback(data)
  }

  const init = async() => {
    const vc = props.vcId?await VacancyRepository.getVacancyById(props.vcId):null
    categories.current = vc&&vc.categories.map(e=> e.id)
    currentVacancy.current = vc
  }

  useEffect(()=>{
    init()
  }, [])

  return (<div className={styles.root}> 
    <div className={styles.top}>
      <div className={styles.back}>
        <Image className={styles.image} src={hirerMain} alt={'rec image'} width={814} height={250}/>
      </div>
      <p className={styles.title}>Найти работу в ArbiHunter</p>
      <p className={styles.description}>
        Ежедневно более 1000 людей находят работу в&nbsp;ArbiHunter <br/> которая позволяет им&nbsp;расти и&nbsp;становиться успешными!    
      </p>
      <Link className={styles.createLink} href={'/create/vacancy'}>Разместить вакансию</Link>
    </div>
    <SearchBar fullWidth className={styles.searchBar} onChange={(s)=>onFilterChange({...currentFilters, search: s})}/>
    {!loading &&
      <p className={styles.found}>Найдено {cvContext.foundCvs.length} резюме {props.vcId?'на вакансию '+ currentVacancy.current.name:''}</p>
      ||
      <Spacer basis={88}/>
    }
  
    <div className={styles.content}>
      <div className={styles.filters}>
        <div className={styles.filter}>
          <Filters onFilterChange={onFilterChange}/>
        </div>
      </div>
  
      <div className={styles.vacancies}>
        {loading &&
          <Spinner size={24} color={colors.yellow} />
          ||
          !loading && cvContext.foundCvs?.length > 0 && cvContext.foundCvs?.map(cv=> {
            return <CvItem cv={cv} initialVacancy={currentVacancy.current} onChangeItem={()=> findCvs(currentFilters)}/>
          })
          ||
          <p className='empty'>Нет найденных вакансий</p>
        }
      </div>
    </div>
    </div>)
  }
