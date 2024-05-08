import { useVacancyContext } from 'context/vacancy_state'
import { useEffect, useState } from 'react'
// import VacancyItem from './VacancyItem'
import styles from './index.module.scss'
import VacancyItem from 'components/ui/VacancyItem'
import { IVacancy } from 'data/interfaces/IVacancy'
import Spinner from 'components/ui/Spinner'
import P from '@/components/ui/P'
import useTranslation from 'next-translate/useTranslation'

interface Props {
}

export default function SavedVacancies(props: Props) {
  const {t} = useTranslation()
  const vacancyContext = useVacancyContext()
  const [load, setLoading] = useState<boolean>(true)
  

  useEffect(()=>{
    vacancyContext.setSavedVacancies()
    .then(_=> {
      setLoading(false)
    })
  }, [])

  const onChangeItem = (v: IVacancy) => {
    vacancyContext.removeVacancyFromSaved(v.id)
  }

  return (<div className={styles.root}> 
    <div className={styles.wrapper}>
      {!load &&vacancyContext.savedVCs.length > 0 &&
        vacancyContext.savedVCs.map((el, index) => {
          return <VacancyItem onChangeItem={()=>onChangeItem(el)} key={index}  vacancy={el}/>
        })
        ||
        load && <Spinner size={24}/>
        ||
        <P useThemeColor className='empty'>{t('profile_noSavedVacancies')}</P>
      }
    </div>
  </div>)
}