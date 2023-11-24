import styles from './index.module.scss'

import Spinner from 'components/ui/Spinner'
import { useVacancyContext } from 'context/vacancy_state'
import Scrollbars from 'rc-scrollbars'
import { useEffect, useState } from 'react'
import VacancyItem from '../VacancyItem'

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
    <Scrollbars universal style={{height: '100%'}} autoHide>
      <div className={styles.wrapper}>
        {isLoaded&&vacancyContext.activeVacancies && vacancyContext.activeVacancies.size > 0 &&
          [...vacancyContext.activeVacancies.values()].map((el, index)=> {
            return <VacancyItem 
            key={index} 
            isLast={vacancyContext.activeVacancies.size > 1 && vacancyContext.activeVacancies.size-1 ===index} 
            vacancy={el} 
            isActive={true}/>
          })  
          ||
          isLoaded&&vacancyContext.activeVacancies.size === 0 &&
          <p className={'empty'}>Нет активных вакансий</p>  
          ||
          !isLoaded &&
          <Spinner  size={24}/>
        } 
      </div>
    </Scrollbars>

  </div>)
}