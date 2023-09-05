import { useVacancyContext } from 'context/vacancy_state'
import { useEffect, useState } from 'react'
import VacancyItem from '../VacancyItem'
import styles from './index.module.scss'

interface Props {
}



export default function VacanciesActive(props: Props) {

  const vacancyContext = useVacancyContext()
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  

  useEffect(()=>{
    vacancyContext.setActiveVacancies().then(res=>res&&setIsLoaded(res))
  }, [])

  return (
  <div className={styles.root}> 
  {isLoaded&&vacancyContext.activeVacancies && vacancyContext.activeVacancies.size > 0 &&
    [...vacancyContext.activeVacancies.values()].map(el=> {
      return <VacancyItem vacancy={el} isActive={true}/>
    })    
  } 

  </div>)
}