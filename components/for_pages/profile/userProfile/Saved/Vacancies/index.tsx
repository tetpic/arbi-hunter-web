import { useVacancyContext } from 'context/vacancy_state'
import Scrollbars from 'rc-scrollbars'
import { useEffect } from 'react'
import VacancyItem from './VacancyItem'
import styles from './index.module.scss'

interface Props {
}

export default function SavedVacancies(props: Props) {

  const vacancyContext = useVacancyContext()
  

  useEffect(()=>{
    vacancyContext.setSavedVacancies()
  }, [])

  return (<div className={styles.root}> 
  <Scrollbars universal style={{height: '100%'}} autoHide>
    <div className={styles.wrapper}>
      {vacancyContext.savedVCs.length > 0 &&
        vacancyContext.savedVCs.map((el, index) => {
          return <VacancyItem key={index}  vc={el}/>
        })
      }
    </div>
  </Scrollbars>
  </div>)
}