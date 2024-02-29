import styles from './index.module.scss'

import Spinner from 'components/ui/Spinner'
import { useVacancyContext } from 'context/vacancy_state'
import VacancyItem from '../VacancyItem'

interface Props {
}

export default function VacanciesActive(props: Props) {

  const vacancyContext = useVacancyContext()



  return (
  <div className={styles.root}> 
      <div className={styles.wrapper}>
        {!vacancyContext.isLoading &&vacancyContext.activeVacancies && vacancyContext.activeVacancies.size > 0 &&
          [...vacancyContext.activeVacancies.values()].map((el, index)=> {
            return <VacancyItem 
            key={index} 
            isLast={vacancyContext.activeVacancies.size > 1 && vacancyContext.activeVacancies.size-1 ===index} 
            vacancy={el} 
            isActive={true}/>
          })  
          ||
          !vacancyContext.isLoading &&vacancyContext.activeVacancies.size === 0 &&
          <p className={'empty'}>Нет активных вакансий</p>  
          ||
          vacancyContext.isLoading &&
          <Spinner  size={24}/>
        } 
      </div>
  </div>)
}