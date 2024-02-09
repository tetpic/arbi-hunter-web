import styles from './index.module.scss'

import Spinner from 'components/ui/Spinner'
import { useVacancyContext } from 'context/vacancy_state'
import { useEffect, useState } from 'react'
import VacancyItem from '../VacancyItem'

interface Props {
  type: 'drafts' | 'archive'

}

export default function VacanciesInactive(props: Props) {

  const vacancyContext = useVacancyContext()
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  const vacancies = props.type === 'archive' ? [...vacancyContext.archiveVacancies.values()] : [...vacancyContext.draftVacancies.values()]

  useEffect(()=>{
    vacancyContext.setInactiveVacancies().then(res=>res&&setIsLoaded(res))
  }, [])

  return (<div className={styles.root}> 
  {isLoaded&&vacancies && vacancies.length > 0 &&
    vacancies.map((el, index)=>{
      return <VacancyItem type={props.type} isLast={vacancyContext.archiveVacancies.size > 2&&vacancyContext.archiveVacancies.size-1 === index} vacancy={el} key={el.id} isActive={false}/>
    })
    ||
    isLoaded&&vacancyContext.archiveVacancies.size === 0 &&
    <p className={'empty'}>Нет архивных вакансий</p>  
    ||
    !isLoaded &&
    <Spinner size={24}/>
  }
  </div>)
}