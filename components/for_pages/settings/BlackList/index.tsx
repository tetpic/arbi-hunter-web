// import Modes from '@/components/ui/Modes'
import styles from './index.module.scss'
import { useEffect, useState } from 'react'
import { useVacancyContext } from 'context/vacancy_state'
import BlackListedItem from './BlackListedItem'
import UserRepository from 'data/repositories/UserRepository'
import { IUserProfile } from 'data/interfaces/IUser'
import { useCvContext } from 'context/cv_state'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'

interface Props {
}

enum BlackListModes {
  Vacancies = 'vacancies',
  Companies = 'companies',
  CVs = 'cvs'
}



export default function BlackList(props: Props) {
  const vacancyContext = useVacancyContext()
  const cvContext = useCvContext()
  const userContext = useUserContext()
  const [type, setType] = useState<BlackListModes>(userContext.currentProfile.profileType === ProfileType.Employee?BlackListModes.Vacancies:BlackListModes.CVs)
  const [profiles, setProfiles] = useState<IUserProfile[]>([])

  useEffect(()=>{
    if(userContext.currentProfile.profileType === ProfileType.Employee) {

      vacancyContext.setBlackListedVacancies()
      UserRepository.getBlackListedProfiles()
      .then(res=> {
        if(res) {
          setProfiles(res.data)
        }
      })
    }
    else if(userContext.currentProfile.profileType === ProfileType.Hirer) {
      cvContext.setBlackListedCVs()
      UserRepository.getBlackListedProfiles()
      .then(res=> {
        if(res) {
          setProfiles(res.data)
        }
      })
    }
  }, [])

  return (<div className={styles.root}> 
    {/* <div className={styles.top}>
      <Modes buttons={[
        {name: 'Вакансии', type: BlackListModes.Vacancies},
        {name: 'Компании', type: BlackListModes.Companies}
      ]} activeButton={type} 
      onSet={setType}
      className={styles.modes}
      buttonClassName={styles.modesButton}
      />
      
    </div> */}

    <div className={styles.items}>
      {type === BlackListModes.Vacancies && vacancyContext.savedVCs?.map(el=> {
        return <BlackListedItem key={el.id} vacancy={el} profile={el.profile} onRestore={()=>vacancyContext.removeFromBlackList(el.id)} />
      })}
      {type === BlackListModes.CVs && cvContext.savedCvs?.map(el=> {
        return <BlackListedItem key={el.id} cv={el} profile={el.profile} onRestore={()=>cvContext.removeFromBlackList(el.id)} />
      })}

      {type === BlackListModes.Companies && profiles.map(el=> {
        return <BlackListedItem key={el.id} profile={el} />
      })}
    </div>
  </div>)
}