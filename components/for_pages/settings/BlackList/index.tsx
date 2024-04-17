import Modes from '@/components/ui/Modes'
import styles from './index.module.scss'
import { useEffect, useState } from 'react'
import { useVacancyContext } from 'context/vacancy_state'
import BlackListedItem from './BlackListedItem'
import UserRepository from 'data/repositories/UserRepository'
import { IUserProfile } from 'data/interfaces/IUser'

interface Props {
}

enum BlackListModes {
  Vacancies = 'vacancies',
  Companies = 'companies'
}



export default function BlackList(props: Props) {
  const [type, setType] = useState<BlackListModes>(BlackListModes.Vacancies)
  const vacancyContext = useVacancyContext()
  const [profiles, setProfiles] = useState<IUserProfile[]>([])

  useEffect(()=>{
    vacancyContext.setBlackListedVacancies()
    UserRepository.getBlackListedProfiles()
    .then(res=> {
      if(res) {
        setProfiles(res.data)
      }
    })
  }, [])

  return (<div className={styles.root}> 
    <div className={styles.top}>
      <Modes buttons={[
        {name: 'Вакансии', type: BlackListModes.Vacancies},
        {name: 'Компании', type: BlackListModes.Companies}
      ]} activeButton={type} 
      onSet={setType}
      className={styles.modes}
      buttonClassName={styles.modesButton}
      />
      
    </div>

    <div className={styles.items}>
      {type === BlackListModes.Vacancies && vacancyContext.savedVCs?.map(el=> {
        return <BlackListedItem key={el.id} vacancy={el} onRestore={()=>vacancyContext.removeFromBlackList(el.id)} />
      })}

      {type === BlackListModes.Companies && profiles.map(el=> {
        return <BlackListedItem key={el.id} profile={el} />
      })}
    </div>
  </div>)
}