import styles from './index.module.scss'

import SearchBar from 'components/ui/SearchBar'
import Link from 'next/link'
import recEmpImage from 'images/recruiting/recruiting_employee_page.png'
import Image from 'next/image'
import { useVacancyContext } from 'context/vacancy_state'
import { useEffect, useState } from 'react'
import Spinner from 'components/ui/Spinner'
import { colors } from 'styles/variables'
import Formatter from 'utils/formatter'
import VacancyItem from './VacancyItem'
import Filters from './Filters'
import { IVacancySearchParams } from 'data/interfaces/IVacancy'

interface Props {
}

export default function RecruitingPageEmployee(props: Props) {
  const vacancyContext = useVacancyContext()
  const [loading, setLoading] = useState<boolean>(true)

  const onFilterChange =(data: IVacancySearchParams) => {
    // console.log(data)
  }

  useEffect(()=>{
    vacancyContext.findVacancies()
    .then(_=>{
      setLoading(false)
    })
  }, [])


  return (<div className={styles.root}> 
  <p style={{color: 'white'}}>RECRUITING PAGE HIRER /в разработке/</p>
  <div className={styles.top}>
    <div className={styles.back}>
      <Image className={styles.image} src={recEmpImage} alt={'rec image'} width={814} height={249}/>
    </div>
    <p className={styles.title}>Найти работу в ArbiHunter</p>
    <p className={styles.description}>
      Ежедневно более 1000 людей находят работу в&nbsp;ArbiHunter <br/> которая позволяет им&nbsp;расти и&nbsp;становиться успешными!    
    </p>
    <Link className={styles.createLink} href={'/create/cv'}>Создать резюме</Link>
  </div>
  <SearchBar fullWidth className={styles.searchBar}/>
  {!loading &&
    <p>Найдено {vacancyContext.foundVacancies.length} {Formatter.pluralize(vacancyContext.foundVacancies.length, 'вакансия', 'вакансии', 'вакансий')}</p>
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
        !loading && vacancyContext.foundVacancies?.length > 0 && vacancyContext.foundVacancies?.map(vacancy=> {
          return <VacancyItem vacancy={vacancy}/>
        })
      }
      

    </div>
  </div>
  </div>)
}