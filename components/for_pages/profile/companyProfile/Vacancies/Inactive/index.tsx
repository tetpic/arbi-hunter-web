import styles from './index.module.scss'

import Spinner from 'components/ui/Spinner'
import { useVacancyContext } from 'context/vacancy_state'
import VacancyItem from '../VacancyItem'

interface Props {
  type: 'drafts' | 'archive'

}

export default function VacanciesInactive(props: Props) {
  const vacancyContext = useVacancyContext()
  const vacancies = props.type === 'archive' ? [...vacancyContext.archiveVacancies.values()] : [...vacancyContext.draftVacancies.values()]

  return (<div className={styles.root}> 
  {!vacancyContext.isLoading&&vacancies && vacancies.length > 0 &&
    vacancies.map((el, index)=>{
      return <VacancyItem 
      type={props.type} 
      isLast={vacancies.length > 2&&vacancies.length-1 === index} 
      vacancy={el} 
      key={el.id} 
      isActive={false}
      />
    })
    ||
    !vacancyContext.isLoading&&vacancyContext.archiveVacancies.size === 0 &&
    <p className={'empty'}>Нет архивных вакансий</p>  
    ||
    vacancyContext.isLoading &&
    <Spinner size={24}/>
  }
  </div>)
}