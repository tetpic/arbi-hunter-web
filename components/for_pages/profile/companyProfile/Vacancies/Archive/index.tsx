import { useVacancyContext } from 'context/vacancy_state'
import { useEffect, useState } from 'react'
import VacancyItem from '../VacancyItem'
import styles from './index.module.scss'

interface Props {
}

export default function VacanciesArchive(props: Props) {

  const vacanciesContext = useVacancyContext()
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(()=>{
    vacanciesContext.setArchiveVacancies().then(res=>res&&setIsLoaded(res))
  }, [])

  return (<div className={styles.root}> 
  {isLoaded&&vacanciesContext.archiveVacancies && vacanciesContext.archiveVacancies.size > 0 &&
    [...vacanciesContext.archiveVacancies.values()].map(el=>{
      return <VacancyItem vacancy={el} isActive={false}/>
    })
  }
  </div>)
}