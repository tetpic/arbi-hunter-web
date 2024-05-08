import styles from './index.module.scss'

import Spinner from 'components/ui/Spinner'
import { useVacancyContext } from 'context/vacancy_state'
import ProfileVacancyItem from '../ProfileVacancyItem'
import P from '@/components/ui/P'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  type: 'drafts' | 'archive'

}

export default function VacanciesInactive(props: Props) {
  const vacancyContext = useVacancyContext()
  const {t} = useTranslation()
  const vacancies = props.type === 'archive' ? [...vacancyContext.archiveVacancies.values()] : [...vacancyContext.draftVacancies.values()]

  return (<div className={styles.root}> 
  {!vacancyContext.isLoading&&vacancies && vacancies.length > 0 &&
    vacancies.filter(el => el.name.toLocaleLowerCase().includes(vacancyContext.searchString.toLowerCase())).map((el, index)=>{
      return <ProfileVacancyItem 
      type={props.type} 
      isLast={vacancies.length > 2&&vacancies.length-1 === index} 
      vacancy={el} 
      key={el.id} 
      isActive={false}
      />
    })
    ||
    !vacancyContext.isLoading&&vacancyContext.archiveVacancies.size === 0 && props.type === 'archive' &&
    <P useThemeColor className={'empty'}>{t('vacancies_noArchive')}</P>  
    ||
    !vacancyContext.isLoading&&vacancyContext.draftVacancies.size === 0 && props.type === 'drafts' &&
    <P useThemeColor className={'empty'}>{t('vacancies_noDraft')}</P>  
    ||
    vacancyContext.isLoading &&
    <Spinner size={24}/>
  }
  </div>)
}