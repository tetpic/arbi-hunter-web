import Spinner from 'components/ui/Spinner'
import { useVacancyContext } from 'context/vacancy_state'
import { useEffect, useState } from 'react'
import { colors } from 'styles/variables'
import VacancyItem from '../VacancyItem'
import styles from './index.module.scss'

interface Props {
}

export default function VacanciesArchive(props: Props) {

  const vacancyContext = useVacancyContext()
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(()=>{
    vacancyContext.setArchiveVacancies().then(res=>res&&setIsLoaded(res))
  }, [])

  return (<div className={styles.root}> 
  {isLoaded&&vacancyContext.archiveVacancies && vacancyContext.archiveVacancies.size > 0 &&
    [...vacancyContext.archiveVacancies.values()].map((el, index)=>{
      return <VacancyItem isLast={vacancyContext.archiveVacancies.size > 2&&vacancyContext.archiveVacancies.size-1 === index} vacancy={el} key={el.id} isActive={false}/>
    })
    ||
    isLoaded&&vacancyContext.archiveVacancies.size === 0 &&
    <p className={'empty'}>Нет архивных вакансий</p>  
    ||
    !isLoaded &&
    <Spinner color={colors.yellow} size={24}/>
  }
  </div>)
}