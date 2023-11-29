import styles from './index.module.scss'

import SearchBar from 'components/ui/SearchBar'
import Link from 'next/link'
// import recEmpImage from 'images/recruiting/recruiting_employee_page.png'
// import Image from 'next/image'
import { useVacancyContext } from 'context/vacancy_state'
import { useEffect, useState } from 'react'
import Spinner from 'components/ui/Spinner'
import Formatter from 'utils/formatter'
import Filters from '../Filters'
import Spacer from 'components/ui/Spacer'
import { useThrottleFn } from '@react-cmpt/use-throttle'
import { useCvContext } from 'context/cv_state'
import { IVacancyCvSearchParams } from 'data/interfaces/Common'
import VacancyItem from 'components/ui/VacancyItem'
import Rive from '@rive-app/react-canvas'

interface Props {
}

export default function RecruitingPageEmployee(props: Props) {
  const vacancyContext = useVacancyContext()
  const cvContext = useCvContext()
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


  return (<div className={styles.root}> 
  <div className={styles.top}>
    <div className={styles.back}>
      {/* <Image className={styles.image} src={recEmpImage} alt={'rec image'} width={814} height={249}/> */}
      <Rive 
      src={'/rive/cv_laptop.riv'} 
      animations={['MoneyLoop','Laptop','HandR','HandL','Head','Eyes','Boot',]} 
      className={styles.image}/>

    </div>
    <p className={styles.title}>Найти работу в ArbiHunter</p>
    <p className={styles.description}>
      Ежедневно более 1000 людей находят работу в&nbsp;ArbiHunter <br/> которая позволяет им&nbsp;расти и&nbsp;становиться успешными!    
    </p>
    <Link className={styles.createLink} href={'/create/cv'}>Создать резюме</Link>
  </div>
  <SearchBar fullWidth className={styles.searchBar} onChange={(s)=>onFilterChange({...currentFilters, search: s})}/>
  {!loading &&
    <p className={styles.found}>Найдено {vacancyContext.foundVacancies.length} {Formatter.pluralize(vacancyContext.foundVacancies.length, 'вакансия', 'вакансии', 'вакансий')}</p>
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
        <Spinner size={24} />
        ||
        !loading && vacancyContext.foundVacancies?.length > 0 && vacancyContext.foundVacancies?.map(vacancy=> {
          return <VacancyItem vacancy={vacancy} onChangeItem={()=>findVacancies(currentFilters)}/>
        })
        ||
        <p className='empty'>Нет найденных вакансий</p>
      }
    </div>
  </div>
  </div>)
}