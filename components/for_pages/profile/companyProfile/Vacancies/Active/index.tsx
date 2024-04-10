import styles from './index.module.scss'

import Spinner from 'components/ui/Spinner'
import { useVacancyContext } from 'context/vacancy_state'
import ProfileVacancyItem from '../ProfileVacancyItem'
import P from '@/components/ui/P'

interface Props {
}

export default function VacanciesActive(props: Props) {

  const vacancyContext = useVacancyContext()



  return (
  <div className={styles.root}> 
      <div className={styles.wrapper}>
        {!vacancyContext.isLoading &&vacancyContext.activeVacancies && vacancyContext.activeVacancies.size > 0 &&
          [...vacancyContext.activeVacancies.values()].map((el, index)=> {
            return <ProfileVacancyItem 
            key={index} 
            isLast={vacancyContext.activeVacancies.size > 1 && vacancyContext.activeVacancies.size-1 ===index} 
            vacancy={el} 
            isActive={true}/>
          })  
          ||
          !vacancyContext.isLoading &&vacancyContext.activeVacancies.size === 0 &&
          <P useThemeColor className={'empty'}>Нет активных вакансий</P>  
          ||
          vacancyContext.isLoading &&
          <Spinner  size={24}/>
        } 
      </div>
  </div>)
}